export abstract class CacheRepository {
    abstract get<T>(key: string): Promise<T | null>;
    abstract set(key: string, value: any, ttl?: number): Promise<void>;
    abstract del(key: string): Promise<void>;
    abstract remember<T>(key: string, ttl: number, callback: () => Promise<T>,): Promise<T>;
}