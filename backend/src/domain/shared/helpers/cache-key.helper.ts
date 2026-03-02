import { createHash } from 'node:crypto';

export function makeCacheKey(prefix: string, userId: string) {
  return `${prefix}:${userId}`;
}

export function generateHash(value: string): string {
  return createHash('sha256').update(value.trim()).digest('hex');
}
