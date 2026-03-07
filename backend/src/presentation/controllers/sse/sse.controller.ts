import { Controller, Get, UseGuards, Res } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/infrastructure/auth/current-user.decorator';
import type { Response } from 'express';
import { SseRepository } from 'src/domain/repositories/sse.repository';

@UseGuards(JwtAuthGuard)
@Controller('events')
export class SseController {
  constructor(private readonly sseRepository: SseRepository) { }

  @Get('connect')
  connect(@CurrentUser('id') userId: string, @Res() res: Response) {
    this.sseRepository.registerClient(userId, res);
  }
}
