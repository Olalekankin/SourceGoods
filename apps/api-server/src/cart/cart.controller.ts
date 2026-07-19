import { Controller, Get, Post, Patch, Delete, Param, Body, Req, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { DRIZZLE_DB } from '../db.module';
import { productsTable } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { Request } from 'express';
import {
  AddCartItemBody,
  UpdateCartItemBody,
  GetCartResponse,
  AddCartItemResponse,
  UpdateCartItemResponse,
  RemoveCartItemResponse,
} from "@workspace/api-zod";

@Controller('api')
export class CartController {
  private readonly carts = new Map<string, Array<{
    productId: string;
    productName: string;
    slug: string;
    unitPrice: number;
    currency: string;
    quantity: number;
    imageUrl: string | null;
    isPreOrder: boolean;
  }>>();

  constructor(@Inject(DRIZZLE_DB) private readonly db: any) {}

  private getCartKey(req: Request): string {
    const auth = req.headers.authorization;
    if (auth?.startsWith("Bearer ")) return auth.slice(7);
    return req.ip ?? "anon";
  }

  private buildCartResponse(items: Array<any>) {
    const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    return {
      items,
      subtotal,
      currency: items[0]?.currency ?? "USD",
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    };
  }

  @Get('cart')
  getCart(@Req() req: Request) {
    const key = this.getCartKey(req);
    const items = this.carts.get(key) ?? [];
    return GetCartResponse.parse(this.buildCartResponse(items));
  }

  @Post('cart/items')
  async addItem(@Req() req: Request, @Body() body: any) {
    const parsed = AddCartItemBody.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.message);
    }

    const { productId, quantity } = parsed.data;
    const [product] = await this.db.select().from(productsTable).where(eq(productsTable.id, productId)).limit(1);

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    const key = this.getCartKey(req);
    const items = this.carts.get(key) ?? [];
    const existing = items.find((i) => i.productId === productId);

    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        productId,
        productName: product.name,
        slug: product.slug,
        unitPrice: Number(product.basePrice),
        currency: product.currency,
        quantity,
        imageUrl: product.primaryImageUrl ?? null,
        isPreOrder: product.isPreOrder,
      });
    }

    this.carts.set(key, items);
    return AddCartItemResponse.parse(this.buildCartResponse(items));
  }

  @Patch('cart/items/:productId')
  async updateItem(@Req() req: Request, @Param('productId') productId: string, @Body() body: any) {
    const parsed = UpdateCartItemBody.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.message);
    }

    const key = this.getCartKey(req);
    let items = this.carts.get(key) ?? [];

    if (parsed.data.quantity === 0) {
      items = items.filter((i) => i.productId !== productId);
    } else {
      const existing = items.find((i) => i.productId === productId);
      if (existing) existing.quantity = parsed.data.quantity;
    }

    this.carts.set(key, items);
    return UpdateCartItemResponse.parse(this.buildCartResponse(items));
  }

  @Delete('cart/items/:productId')
  removeItem(@Req() req: Request, @Param('productId') productId: string) {
    const key = this.getCartKey(req);
    const items = (this.carts.get(key) ?? []).filter((i) => i.productId !== productId);
    this.carts.set(key, items);
    return RemoveCartItemResponse.parse(this.buildCartResponse(items));
  }
}
