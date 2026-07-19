import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DRIZZLE_DB } from '../db.module';
import { usersTable } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { Inject } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    @Inject(DRIZZLE_DB) private readonly db: any
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const auth = request.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Authentication required");
    }

    const token = auth.slice(7);
    const userId = this.authService.sessions.get(token);
    if (!userId) {
      throw new UnauthorizedException("Invalid or expired session");
    }

    const [user] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    request.currentUser = user;
    return true;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.currentUser;
    if (!user) {
      throw new UnauthorizedException("Authentication required");
    }
    if (user.role !== 'admin' && user.role !== 'superadmin') {
      throw new ForbiddenException("Admin access required");
    }
    return true;
  }
}
