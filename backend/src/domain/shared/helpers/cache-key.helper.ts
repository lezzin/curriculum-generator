export function makeCacheKey(prefix: string, userId: string) {
    return `${prefix}:${userId}`
}