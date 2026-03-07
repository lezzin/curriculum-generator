import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { SseRepository } from 'src/domain/repositories/sse.repository';

interface RedisSSEPayload {
    userId: string;
    event: string;
    data: unknown;
}

@Injectable()
export class RedisSubscriberService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisSubscriberService.name);
    private subscriber: Redis;

    private readonly CHANNEL = 'report-processor-database-sse-events';

    constructor(
        private readonly sseRepository: SseRepository,
        configService: ConfigService
    ) {
        this.subscriber = new Redis({
            host: configService.get('REDIS_HOST') || 'localhost',
            port: configService.get<number>('REDIS_PORT') || 6379,
        });
    }

    onModuleInit() {
        this.subscriber.subscribe(this.CHANNEL);

        this.subscriber.on('message', (channel, message) => {
            if (channel !== this.CHANNEL) return;

            try {
                const payload: RedisSSEPayload = JSON.parse(message);

                this.sseRepository.sendEvent(
                    payload.userId,
                    payload.event,
                    payload.data
                );
            } catch {
                this.logger.error(`Payload inválido: ${message}`);
            }
        });
    }

    onModuleDestroy() {
        this.subscriber.quit();
    }
}