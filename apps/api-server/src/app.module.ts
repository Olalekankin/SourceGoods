import { Module } from '@nestjs/common';
import { DbModule } from './db.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { CategoriesModule } from './categories/categories.module';
import { StorefrontModule } from './storefront/storefront.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    DbModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    CartModule,
    CategoriesModule,
    StorefrontModule,
    HealthModule,
  ],
})
export class AppModule {}
