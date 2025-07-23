import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async getHealth() {
    return await this.healthService.getHealthStatus();
  }

  @Get('postgres')
  async getPostgresHealth() {
    return await this.healthService.getPostgresHealth();
  }

  @Get('mongodb')
  async getMongodbHealth() {
    return await this.healthService.getMongodbHealth();
  }

  @Get('detailed')
  async getDetailedHealth() {
    return await this.healthService.getDetailedHealthStatus();
  }
}
