import { Module, Global } from '@nestjs/common';
import { db } from '@workspace/db';

export const DRIZZLE_DB = 'DRIZZLE_DB';

console.log('[DbModule] process.env.DATABASE_URL present:', !!process.env.DATABASE_URL);
console.log('[DbModule] imported db is null:', db === null, 'pool is null:', (db as any)?.pool === null);

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_DB,
      useValue: db,
    },
  ],
  exports: [DRIZZLE_DB],
})
export class DbModule {}
