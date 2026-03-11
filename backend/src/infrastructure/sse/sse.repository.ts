import { Injectable, Logger } from '@nestjs/common';
import type { Response } from 'express';
import { SseRepository } from 'src/domain/repositories/sse.repository';

@Injectable()
export class RedisSseRepository implements SseRepository {
  private readonly logger = new Logger(RedisSseRepository.name);
  private clients: Map<string, Set<Response>> = new Map();

  registerClient(userId: string, res: Response): void {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    res.flushHeaders();

    const heartbeat = setInterval(() => {
      if (res.writableEnded) return clearInterval(heartbeat);
      res.write(': heartbeat\n\n');
    }, 15000);

    if (!this.clients.has(userId)) this.clients.set(userId, new Set());
    this.clients.get(userId)!.add(res);

    res.on('close', () => {
      clearInterval(heartbeat);
      this.clients.get(userId)?.delete(res);
      if (this.clients.get(userId)?.size === 0) this.clients.delete(userId);
      this.logger.log(`SSE desconectado: user=${userId}`);
    });
  }

  sendEvent<T>(userId: string, event: string, data: T): void {
    const connections = this.clients.get(String(userId));
    if (!connections?.size) return;

    const payload = JSON.stringify(data);
    connections.forEach((res) => {
      if (res.writableEnded) return;
      res.write(`event: ${event}\n`);
      res.write(`data: ${payload}\n\n`);
    });
  }
}
