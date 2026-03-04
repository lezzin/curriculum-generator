export abstract class CacheRepository {
  abstract get<T>(key: string): Promise<T | null>;
  abstract set(key: string, value: any, ttl?: number): Promise<void>;

  abstract rememberByScope<T>(
    scope: string,
    userId: string,
    ttl: number,
    callback: () => Promise<T>,
  ): Promise<T>;

  abstract rememberByHash<T>(
    rawKey: string,
    ttl: number,
    callback: () => Promise<T>,
  ): Promise<T>;

  abstract invalidateScope(scope: string, userId: string): Promise<void>;
  abstract invalidateByHash(rawKey: string): Promise<void>;
}
