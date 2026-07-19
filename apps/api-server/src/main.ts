import path from 'path';
import { config } from 'dotenv';

import fs from 'fs';

const candidatePaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../../.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(__dirname, '../../../../.env'),
];

let envLoaded = false;
for (const p of candidatePaths) {
  if (fs.existsSync(p)) {
    console.log('[Bootstrap] loading .env from', p);
    config({ path: p });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.warn('[Bootstrap] WARNING: No .env file found in candidate paths:', candidatePaths);
}

async function bootstrap() {
  const { NestFactory } = await import('@nestjs/core');
  const { AppModule } = await import('./app.module');
  const { Logger } = await import('@nestjs/common');

  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  let rawPort = process.env.PORT;
  if (!rawPort) {
    rawPort = '4000';
    logger.warn('PORT not set; defaulting to 4000');
  }

  const port = Number(rawPort);
  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }

  await app.listen(port);
  logger.log(`Server listening on port ${port}`);
}

bootstrap();
