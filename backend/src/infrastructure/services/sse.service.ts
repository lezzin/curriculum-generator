import { Injectable, Logger } from '@nestjs/common';
import type { Response } from 'express';

@Injectable()
export class SseService {
    private readonly logger = new Logger(SseService.name);
    private clients: Map<string, Set<Response>> = new Map();

    registerClient(userId: string, res: Response) {
        res.set({
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        });

        res.flushHeaders();

        if (!this.clients.has(userId)) this.clients.set(userId, new Set());
        this.clients.get(userId)?.add(res);

        res.on('close', () => {
            this.clients.get(userId)?.delete(res);
            this.logger.log(`SSE connection closed for user ${userId}`);
        });
    }

    sendEvent(userId: string, event: string, data: any) {
        const payload = JSON.stringify(data);

        this.clients.get(userId)?.forEach((res) => {
            res.write(`event: ${event}\n`);
            res.write(`data: ${payload}\n\n`);
        });
    }
}