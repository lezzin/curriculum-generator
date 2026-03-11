import * as bcrypt from 'bcryptjs';
import { HashRepository } from 'src/domain/repositories/hash.repository';

export class BcryptAdapter extends HashRepository {
  private readonly salt = 10;

  async hash(payload: string): Promise<string> {
    return bcrypt.hash(payload, this.salt);
  }

  async compare(payload: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(payload, hashed);
  }
}
