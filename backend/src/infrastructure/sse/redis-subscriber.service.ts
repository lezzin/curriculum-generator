import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { SseRepository } from 'src/domain/repositories/sse.repository';

@Injectable()
export class RedisSubscriberService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisSubscriberService.name);
    private readonly subscriber: Redis;
    private channel: string;

    constructor(
        private readonly sseRepository: SseRepository,
        configService: ConfigService
    ) {
        this.subscriber = new Redis({
            host: configService.get('REDIS_HOST') || 'localhost',
            port: configService.get<number>('REDIS_PORT') || 6379,
        });

        this.channel = configService.getOrThrow('SSE_CHANNEL')
    }

    async onModuleInit() {
        await this.subscriber.psubscribe(this.channel);

        this.subscriber.on('pmessage', (pattern, channel, message) => {
            const userId = channel.substring(channel.lastIndexOf(':') + 1);

            try {
                const payload = JSON.parse(message);

                this.sseRepository.sendEvent(
                    userId,
                    payload.meta.event,
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