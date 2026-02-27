import { randomUUID } from "crypto";
import { UserConfig } from "src/domain/entities/user.config.entity";
import { UserConfigRepository } from "src/domain/repositories/user-config.repository";

export class UpsertUserConfigUseCase {
    constructor(
        private userConfigRepository: UserConfigRepository,
    ) { }

    async execute(
        userId: string,
        linkedin?: string,
        github?: string,
        portfolio?: string,
        cellphone?: string,
    ) {
        await this.userConfigRepository.upsert(new UserConfig(
            randomUUID(),
            userId,
            linkedin,
            github,
            portfolio,
            cellphone
        ));
    }
}