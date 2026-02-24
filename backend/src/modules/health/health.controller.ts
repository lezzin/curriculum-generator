import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  root() {
    return { status: 'ok' };
  }
}
