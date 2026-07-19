import { Controller, Get, Post, Patch, Param, Query, Body, Req, UseGuards, BadRequestException, NotFoundException, UnauthorizedException, Inject } from '@nestjs/common';
import { DRIZZLE_DB } from '../db.module';
import { ordersTable, productsTable, usersTable } from '@workspace/db';
import { eq, desc, and, inArray, type SQL } from "drizzle-orm";
import { AuthGuard, AdminGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import {
  CreateOrderBody,
  GetOrderParams,
  UpdateOrderStatusBody,
  ListOrdersQueryParams,
  ListOrdersResponse,
  CreateOrderResponse,
  GetOrderResponse,
  UpdateOrderStatusResponse,
} from "@workspace/api-zod";

type AuthUser = { id: string; role: string };

type StatusHistoryEntry = {
  status: string;
  note?: string | null;
  changedAt: string;
  changedBy?: string | null;
};

export function serializeOrder(o: Record<string, any>) {
  return {
    ...o,
    subtotal: Number(o.subtotal),
    shippingFee: Number(o.shippingFee ?? 0),
    total: Number(o.total),
    createdAt:
      o.createdAt instanceof Date ? o.createdAt.toISOString() : String(o.createdAt),
  };
}

@Controller('api')
export class OrdersController {
  constructor(
    @Inject(DRIZZLE_DB) private readonly db: any,
    private readonly authService: AuthService
  ) {}

  private async getAuthUser(req: Request): Promise<AuthUser | null> {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) return null;
    const userId = this.authService.sessions.get(auth.slice(7));
    if (!userId) return null;
    const [user] = await this.db
      .select({ id: usersTable.id, role: usersTable.role })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);
    return user ?? null;
  }

  @Get('orders')
  async list(@Req() req: Request, @Query() query: any) {
    const caller = await this.getAuthUser(req);
    if (!caller) {
      throw new UnauthorizedException("Authentication required");
    }

    const parsed = ListOrdersQueryParams.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.message);
    }

    const { page = 1, limit = 20, fulfillmentStatus, paymentStatus } = parsed.data;
    const conditions: SQL[] = [];

    if (caller.role !== "admin" && caller.role !== "superadmin") {
      conditions.push(eq(ordersTable.userId, caller.id));
    }

    if (fulfillmentStatus)
      conditions.push(
        eq(
          ordersTable.fulfillmentStatus,
          fulfillmentStatus as any,
        ),
      );
    if (paymentStatus)
      conditions.push(
        eq(
          ordersTable.paymentStatus,
          paymentStatus as any,
        ),
      );

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [items, allItems] = await Promise.all([
      this.db
        .select()
        .from(ordersTable)
        .where(where)
        .orderBy(desc(ordersTable.createdAt))
        .limit(limit)
        .offset((page - 1) * limit),
      this.db.select({ id: ordersTable.id }).from(ordersTable).where(where),
    ]);

    return ListOrdersResponse.parse({
      items: items.map(serializeOrder),
      total: allItems.length,
      page,
      limit,
    });
  }

  @Post('orders')
  async create(@Req() req: Request, @Body() body: any) {
    const parsed = CreateOrderBody.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.message);
    }

    const { items, paymentMethod, shippingAddress } = parsed.data;

    // Fetch all referenced products in a single query
    const productIds = [...new Set(items.map((i) => i.productId))];
    const foundProducts =
      productIds.length > 0
        ? await this.db
            .select()
            .from(productsTable)
            .where(inArray(productsTable.id, productIds))
        : [];

    const productMap = new Map(foundProducts.map((p: any) => [p.id, p]));

    const unknownIds = productIds.filter((id) => !productMap.has(id));
    if (unknownIds.length > 0) {
      throw new BadRequestException(`Unknown product IDs: ${unknownIds.join(", ")}`);
    }

    const orderItems = items.map((item) => {
      const product: any = productMap.get(item.productId)!;
      return {
        productId: item.productId,
        slug: product.slug,
        sku: item.variantSku ?? item.productId,
        name: product.name,
        unitPrice: Number(product.basePrice),
        currency: product.currency,
        quantity: item.quantity,
        imageUrl: product.primaryImageUrl ?? null,
      };
    });

    const subtotal = orderItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const shippingFee = 0;
    const total = subtotal + shippingFee;
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const initialHistory: StatusHistoryEntry[] = [
      { status: "pending", changedAt: new Date().toISOString() },
    ];

    // Read logged in user to associate order if present
    const caller = await this.getAuthUser(req);

    const [order] = await this.db
      .insert(ordersTable)
      .values({
        orderNumber,
        userId: caller?.id ?? null,
        items: orderItems,
        subtotal: String(subtotal),
        shippingFee: String(shippingFee),
        total: String(total),
        currency: "USD",
        paymentMethod,
        paymentStatus: "pending",
        fulfillmentStatus: "pending",
        shippingAddress,
        statusHistory: initialHistory,
      })
      .returning();

    return CreateOrderResponse.parse(serializeOrder(order as Record<string, unknown>));
  }

  @Get('orders/:id')
  @UseGuards(AuthGuard, AdminGuard)
  async getById(@Param('id') rawId: string) {
    const parsed = GetOrderParams.safeParse({ id: rawId });
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.message);
    }

    const [order] = await this.db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, parsed.data.id))
      .limit(1);

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    return GetOrderResponse.parse(serializeOrder(order as Record<string, unknown>));
  }

  @Patch('orders/:id')
  @UseGuards(AuthGuard, AdminGuard)
  async updateStatus(@Param('id') rawId: string, @Body() body: any) {
    const parsed = UpdateOrderStatusBody.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.message);
    }

    const [existing] = await this.db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, rawId))
      .limit(1);
    if (!existing) {
      throw new NotFoundException("Order not found");
    }

    const previousHistory = (existing.statusHistory ?? []) as StatusHistoryEntry[];
    const newEntry: StatusHistoryEntry = {
      status: parsed.data.fulfillmentStatus,
      note: parsed.data.note,
      changedAt: new Date().toISOString(),
    };
    const history: StatusHistoryEntry[] = [...previousHistory, newEntry];

    const [order] = await this.db
      .update(ordersTable)
      .set({ fulfillmentStatus: parsed.data.fulfillmentStatus, statusHistory: history })
      .where(eq(ordersTable.id, rawId))
      .returning();

    return UpdateOrderStatusResponse.parse(serializeOrder(order as Record<string, unknown>));
  }
}
