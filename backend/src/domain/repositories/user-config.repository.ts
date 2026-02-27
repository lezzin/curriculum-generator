import { UserConfig } from "../entities/user.config.entity";

export abstract class UserConfigRepository {
    abstract upsert(userConfig: UserConfig): Promise<void>;
    abstract getByUserId(userId: string): Promise<UserConfig | null>;
}