import { Injectable, Inject, Logger } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async getOrSet<T>(
    key: string,
    callback: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const cached = await this.cacheManager.get<T>(key);

    if (cached) {
      this.logger.log(`Cache hit for key: ${key}`);
      return cached;
    }

    this.logger.log(`Cache miss for key: ${key}. Fetching fresh data...`);

    const fresh = await callback();
    await this.cacheManager.set(key, fresh, this.createTtl(ttl));
    return fresh;
  }

  async get<T>(key: string): Promise<T | null> {
    return (await this.cacheManager.get<T>(key)) || null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, this.createTtl(ttl));
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
    this.logger.log(`Cache key deleted: ${key}`);
  }

  async reset(): Promise<void> {
    await this.cacheManager.clear();
    this.logger.warn(`Cache cleared`);
  }

  createTtl(seconds?: number): number | undefined {
    return seconds ? seconds * 1000 : undefined;
  }
}
