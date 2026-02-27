import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';
import { CurrentUser } from 'src/infrastructure/auth/current-user.decorator';
import { SseService } from 'src/infrastructure/services/sse.service';
import type { Request, Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('events')
export class SseController {
    constructor(private readonly sseService: SseService) { }

    @Get('connect')
    connect(@CurrentUser('id') userId: string, @Req() req: Request, @Req() res: Response) {
        this.sseService.registerClient(userId, res);
    }
}