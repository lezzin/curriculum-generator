import { UserConfig } from '../entities/user.config.entity';

export abstract class UserConfigRepository {
  abstract upsert(userConfig: UserConfig): Promise<void>;
  abstract findByUserId(userId: string): Promise<UserConfig | null>;
}
