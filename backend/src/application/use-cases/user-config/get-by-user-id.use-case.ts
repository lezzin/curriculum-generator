import { UserConfigRepository } from "src/domain/repositories/user-config.repository";

export class GetByUserIdUserConfigUseCase {
    constructor(
        private userConfigRepository: UserConfigRepository,
    ) { }

    async execute(userId: string) {
        return await this.userConfigRepository.getByUserId(userId);
    }
}