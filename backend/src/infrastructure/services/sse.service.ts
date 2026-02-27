import { Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class SseService {
    private readonly logger = new Logger(SseService.name);
    private clients: Map<string, Response[]> = new Map();

    registerClient(userId: string, res: Response) {
        res.set({
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        });

        res.flushHeaders();

        if (!this.clients.has(userId)) {
            this.clients.set(userId, []);
        }

        this.clients.get(userId)?.push(res);

        res.on('close', () => {
            const arr = this.clients.get(userId) || [];

            this.clients.set(
                userId,
                arr.filter((r) => r !== res),
            );

            this.logger.log(`SSE connection closed for user ${userId}`);
        });
    }

    sendEvent(userId: string, event: string, data: any) {
        const connections = this.clients.get(userId) || [];

        connections.forEach((res) => {
            res.write(`event: ${event}\n`);
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        });
    }
}