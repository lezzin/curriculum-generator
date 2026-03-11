import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { CacheRepository } from 'src/domain/repositories/cache.repository';

@Injectable()
export class CacheAdapter implements CacheRepository {
  private readonly namespace = 'app:v1';

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async get<T>(key: string): Promise<T | null> {
    return (await this.cache.get(key)) as T;
  }

  async set(key: string, value: any, ttlInMinutes?: number): Promise<void> {
    let ttlInMs: number | undefined;

    if (ttlInMinutes !== undefined) {
      ttlInMs = ttlInMinutes * 60 * 1000;
    }

    await this.cache.set(key, value, ttlInMs);
  }

  async rememberByScope<T>(
    scope: string,
    userId: string,
    ttl: number,
    callback: () => Promise<T>,
  ): Promise<T> {
    const key = this.buildScopedKey(scope, userId);
    return this.remember(key, ttl, callback);
  }

  async rememberByHash<T>(
    rawKey: string,
    ttl: number,
    callback: () => Promise<T>,
  ): Promise<T> {
    const key = this.buildHashedKey(rawKey);
    return this.remember(key, ttl, callback);
  }

  async invalidateScope(scope: string, userId: string): Promise<void> {
    const key = this.buildScopedKey(scope, userId);
    await this.cache.del(key);
  }

  async invalidateByHash(rawKey: string): Promise<void> {
    const key = this.buildHashedKey(rawKey);
    await this.cache.del(key);
  }

  private async remember<T>(
    key: string,
    ttl: number,
    callback: () => Promise<T>,
  ): Promise<T> {
    const cached = (await this.cache.get(key)) as T | null;

    if (cached !== null && cached !== undefined) {
      return cached;
    }

    const result = await callback();

    if (result !== null && result !== undefined) {
      await this.set(key, result, Math.floor(ttl));
    }

    return result;
  }

  private buildScopedKey(scope: string, userId: string): string {
    return `${this.namespace}:${scope}:${userId}`;
  }

  private buildHashedKey(raw: string): string {
    const hash = createHash('sha256').update(raw.trim()).digest('hex');
    return `${this.namespace}:hash:${hash}`;
  }
}
