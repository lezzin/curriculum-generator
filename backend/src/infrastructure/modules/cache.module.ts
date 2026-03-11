import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { CacheAdapter } from '../cache/cache.adapter';
import { CacheRepository } from 'src/domain/repositories/cache.repository';
import { redisStore } from 'cache-manager-redis-yet';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get('REDIS_HOST') || 'localhost',
            port: configService.get<number>('REDIS_PORT') || 6379,
          },
        }),
      }),
    }),
  ],
  providers: [
    CacheAdapter,
    {
      provide: CacheRepository,
      useExisting: CacheAdapter,
    },
  ],
  exports: [CacheRepository],
})
export class InfrastructureCacheModule {}
