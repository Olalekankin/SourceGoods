import { Controller, Get } from '@nestjs/common';
import { HealthCheckResponse } from "@workspace/api-zod";

@Controller()
export class HealthController {
  @Get('api/healthz')
  healthz() {
    return HealthCheckResponse.parse({ status: "ok" });
  }
}
