import { Injectable, Inject, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { DRIZZLE_DB } from '../db.module';
import { usersTable } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
  public readonly sessions = new Map<string, string>(); // token -> userId

  constructor(@Inject(DRIZZLE_DB) private readonly db: any) {}

  hashPassword(password: string): string {
    return createHash("sha256")
      .update(password + (process.env.SESSION_SECRET ?? ""))
      .digest("hex");
  }

  makeToken(userId: string): string {
    return createHash("sha256")
      .update(userId + Date.now() + (process.env.SESSION_SECRET ?? ""))
      .digest("hex");
  }

  serializeUser(u: any) {
    return {
      id: u.id,
      email: u.email,
      name: u.name,
      avatarUrl: u.avatarUrl ?? null,
      role: u.role,
      createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : String(u.createdAt),
    };
  }

  async register(body: any) {
    const { email, password, name } = body;

    const existing = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException("Email already in use");
    }

    const [user] = await this.db
      .insert(usersTable)
      .values({
        email,
        name,
        passwordHash: this.hashPassword(password),
        role: "customer",
      })
      .returning();

    if (!user) {
      throw new InternalServerErrorException("Failed to create user");
    }

    const token = this.makeToken(user.id);
    this.sessions.set(token, user.id);

    return { user: this.serializeUser(user), token };
  }

  async login(body: any) {
    const { email, password } = body;
    const [user] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user || user.passwordHash !== this.hashPassword(password)) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const token = this.makeToken(user.id);
    this.sessions.set(token, user.id);

    return { user: this.serializeUser(user), token };
  }

  logout(token: string) {
    if (token) {
      this.sessions.delete(token);
    }
  }

  async getMe(token: string) {
    const userId = this.sessions.get(token);
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }

    const [user] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return this.serializeUser(user);
  }
}
