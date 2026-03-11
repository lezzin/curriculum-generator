import type { Response } from 'express';

export abstract class SseRepository {
  abstract registerClient(userId: string, res: Response): void;
  abstract sendEvent<T>(userId: string, event: string, data: T): void;
}
