import { hash, verify } from 'argon2';
import { HashRepository } from 'src/domain/repositories/hash.repository';

export class Argon2Adapter extends HashRepository {
  async hash(payload: string): Promise<string> {
    return hash(payload);
  }

  async compare(payload: string, hashed: string): Promise<boolean> {
    return verify(hashed, payload);
  }
}
