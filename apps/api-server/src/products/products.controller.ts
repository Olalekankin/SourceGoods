import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards, BadRequestException, NotFoundException, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { DRIZZLE_DB } from '../db.module';
import { productsTable } from '@workspace/db';
import { eq, desc, ilike, and, type SQL } from "drizzle-orm";
import { AuthGuard, AdminGuard } from '../auth/auth.guard';
import {
  ListProductsQueryParams,
  CreateProductBody,
  GetProductParams,
  UpdateProductBody,
  DeleteProductParams,
  ListProductsResponse,
  CreateProductResponse,
  GetProductResponse,
  UpdateProductResponse,
  ListFeaturedProductsResponse,
  ListTrendingProductsResponse,
} from "@workspace/api-zod";

export function serializeProduct(p: Record<string, any>) {
  return {
    ...p,
    basePrice: Number(p.basePrice),
    images: (p.images as string[]) ?? [],
    attributes: (p.attributes as unknown[]) ?? [],
    variants: (p.variants as unknown[]) ?? [],
    currentPreOrderCount: Number(p.currentPreOrderCount ?? 0),
  };
}

@Controller('api')
export class ProductsController {
  constructor(@Inject(DRIZZLE_DB) private readonly db: any) {}

  @Get('products/featured')
  async getFeatured() {
    const products = await this.db
      .select()
      .from(productsTable)
      .where(eq(productsTable.status, "published"))
      .orderBy(desc(productsTable.currentPreOrderCount))
      .limit(8);
    return ListFeaturedProductsResponse.parse(products.map(serializeProduct));
  }

  @Get('products/trending')
  async getTrending() {
    const products = await this.db
      .select()
      .from(productsTable)
      .where(eq(productsTable.status, "published"))
      .orderBy(desc(productsTable.currentPreOrderCount))
      .limit(6);
    return ListTrendingProductsResponse.parse(products.map(serializeProduct));
  }

  @Get('products')
  async list(@Query() query: any) {
    const parsed = ListProductsQueryParams.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.message);
    }

    const { page = 1, limit = 20, category, search, status, isPreOrder } = parsed.data;

    const conditions: SQL[] = [];
    if (category) conditions.push(eq(productsTable.category, category));
    if (status)
      conditions.push(
        eq(productsTable.status, status as "draft" | "published" | "archived"),
      );
    if (isPreOrder !== undefined)
      conditions.push(eq(productsTable.isPreOrder, isPreOrder));
    if (search) conditions.push(ilike(productsTable.name, `%${search}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [items, countResult] = await Promise.all([
      this.db
        .select()
        .from(productsTable)
        .where(where)
        .orderBy(desc(productsTable.createdAt))
        .limit(limit)
        .offset((page - 1) * limit),
      this.db.select().from(productsTable).where(where),
    ]);

    return ListProductsResponse.parse({
      items: items.map(serializeProduct),
      total: countResult.length,
      page,
      limit,
    });
  }

  @Post('products')
  @UseGuards(AuthGuard, AdminGuard)
  async create(@Body() body: any) {
    const parsed = CreateProductBody.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.message);
    }

    const { name, basePrice, estimatedShipDate, ...rest } = parsed.data;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const shipDateStr: string | null =
      estimatedShipDate == null
        ? null
        : estimatedShipDate instanceof Date
          ? estimatedShipDate.toISOString().split("T")[0]!
          : String(estimatedShipDate);

    const [product] = await this.db
      .insert(productsTable)
      .values({
        ...rest,
        name,
        slug: `${slug}-${Date.now()}`,
        basePrice: String(basePrice),
        estimatedShipDate: shipDateStr,
      })
      .returning();

    return CreateProductResponse.parse(serializeProduct(product as Record<string, unknown>));
  }

  @Get('products/:slug')
  async getBySlug(@Param('slug') rawSlug: string) {
    const parsed = GetProductParams.safeParse({ slug: rawSlug });
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.message);
    }

    const [product] = await this.db
      .select()
      .from(productsTable)
      .where(eq(productsTable.slug, parsed.data.slug))
      .limit(1);

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return GetProductResponse.parse(serializeProduct(product as Record<string, unknown>));
  }

  @Patch('products/:slug')
  @UseGuards(AuthGuard, AdminGuard)
  async update(@Param('slug') rawSlug: string, @Body() body: any) {
    const bodyParsed = UpdateProductBody.safeParse(body);
    if (!bodyParsed.success) {
      throw new BadRequestException(bodyParsed.error.message);
    }

    const { basePrice, estimatedShipDate, ...rest } = bodyParsed.data;

    const updates: Record<string, unknown> = { ...rest };
    if (basePrice !== undefined) updates.basePrice = String(basePrice);
    if (estimatedShipDate !== undefined) {
      updates.estimatedShipDate =
        estimatedShipDate == null
          ? null
          : estimatedShipDate instanceof Date
            ? estimatedShipDate.toISOString().split("T")[0]!
            : String(estimatedShipDate);
    }

    const [product] = await this.db
      .update(productsTable)
      .set(updates)
      .where(eq(productsTable.slug, rawSlug))
      .returning();

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return UpdateProductResponse.parse(serializeProduct(product as Record<string, unknown>));
  }

  @Delete('products/:slug')
  @UseGuards(AuthGuard, AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('slug') rawSlug: string) {
    const parsed = DeleteProductParams.safeParse({ slug: rawSlug });
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.message);
    }

    await this.db.delete(productsTable).where(eq(productsTable.slug, parsed.data.slug));
  }
}
