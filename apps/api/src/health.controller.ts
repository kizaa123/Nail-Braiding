import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public';

@Controller('api/health')
export class HealthController {
  @Public()
  @Get()
  health() {
    return { ok: true, service: 'noir-atelier-api' };
  }
}
