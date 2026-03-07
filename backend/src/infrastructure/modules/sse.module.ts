import { Module } from '@nestjs/common';
import { SseRepository } from 'src/domain/repositories/sse.repository';
import { SseController } from 'src/presentation/controllers/sse/sse.controller';
import { RedisSseRepository } from '../sse/sse.repository';
import { RedisSubscriberService } from '../sse/redis-subscriber.service';

@Module({
  controllers: [SseController],
  providers: [
    {
      provide: SseRepository,
      useClass: RedisSseRepository
    },
    RedisSubscriberService,
  ],
  exports: [SseRepository],
})
export class SseModule { }
