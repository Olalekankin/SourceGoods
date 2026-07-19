import { Controller, Get, Inject } from '@nestjs/common';
import { DRIZZLE_DB } from '../db.module';
import { categoriesTable } from '@workspace/db';
import { ListCategoriesResponse } from "@workspace/api-zod";

@Controller('api')
export class CategoriesController {
  constructor(@Inject(DRIZZLE_DB) private readonly db: any) {}

  @Get('categories')
  async list() {
    const categories = await this.db.select().from(categoriesTable).orderBy(categoriesTable.name);
    return ListCategoriesResponse.parse(categories);
  }
}
