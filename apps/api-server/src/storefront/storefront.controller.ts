import { Controller, Get, Inject } from '@nestjs/common';
import { DRIZZLE_DB } from '../db.module';
import { productsTable, categoriesTable } from '@workspace/db';
import { eq, desc, sql } from "drizzle-orm";
import { serializeProduct } from '../products/products.controller';
import {
  GetHomepageDataResponse,
  GetStorefrontStatsResponse,
} from "@workspace/api-zod";

@Controller('api/storefront')
export class StorefrontController {
  constructor(@Inject(DRIZZLE_DB) private readonly db: any) {}

  @Get('home')
  async getHome() {
    const [featured, trending, recentlyAdded, categories, productCount, preOrderCount] =
      await Promise.all([
        this.db
          .select()
          .from(productsTable)
          .where(eq(productsTable.status, "published"))
          .orderBy(desc(productsTable.currentPreOrderCount))
          .limit(8),
        this.db
          .select()
          .from(productsTable)
          .where(eq(productsTable.status, "published"))
          .orderBy(desc(productsTable.currentPreOrderCount))
          .limit(6),
        this.db
          .select()
          .from(productsTable)
          .where(eq(productsTable.status, "published"))
          .orderBy(desc(productsTable.createdAt))
          .limit(10),
        this.db.select().from(categoriesTable).orderBy(categoriesTable.name),
        this.db.select({ count: sql<number>`count(*)` }).from(productsTable),
        this.db
          .select({ count: sql<number>`count(*)` })
          .from(productsTable)
          .where(eq(productsTable.isPreOrder, true)),
      ]);

    const total = Number(productCount[0]?.count ?? 0);
    const preOrders = Number(preOrderCount[0]?.count ?? 0);

    return GetHomepageDataResponse.parse({
      featuredProducts: featured.map(serializeProduct),
      trendingProducts: trending.map(serializeProduct),
      recentlyAdded: recentlyAdded.map(serializeProduct),
      categories,
      stats: {
        totalProducts: total,
        totalCategories: categories.length,
        totalPreOrders: preOrders,
        publishedProducts: total,
      },
    });
  }

  @Get('stats')
  async getStats() {
    const [productCount, preOrderCount, categoryCount] = await Promise.all([
      this.db.select({ count: sql<number>`count(*)` }).from(productsTable).where(eq(productsTable.status, "published")),
      this.db.select({ count: sql<number>`count(*)` }).from(productsTable).where(eq(productsTable.isPreOrder, true)),
      this.db.select({ count: sql<number>`count(*)` }).from(categoriesTable),
    ]);

    return GetStorefrontStatsResponse.parse({
      totalProducts: Number(productCount[0]?.count ?? 0),
      totalCategories: Number(categoryCount[0]?.count ?? 0),
      totalPreOrders: Number(preOrderCount[0]?.count ?? 0),
      publishedProducts: Number(productCount[0]?.count ?? 0),
    });
  }
}
