import { UserConfig } from '../entities/user.config.entity';

export abstract class UserConfigRepository {
  abstract save(userConfig: UserConfig): Promise<void>;
  abstract findByUserId(userId: string): Promise<UserConfig | null>;
}
