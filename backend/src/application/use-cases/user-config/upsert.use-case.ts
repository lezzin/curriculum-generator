import { randomUUID } from 'crypto';
import { UpsertUserConfigInput } from 'src/application/models/upsert-user-config.input';
import { UserConfig } from 'src/domain/entities/user.config.entity';
import { UserConfigRepository } from 'src/domain/repositories/user-config.repository';

export class UpsertUserConfigUseCase {
  constructor(private userConfigRepository: UserConfigRepository) {}

  async execute(body: UpsertUserConfigInput) {
    await this.userConfigRepository.upsert(
      new UserConfig(
        randomUUID(),
        body.userId,
        body.linkedin,
        body.github,
        body.portfolio,
        body.cellphone,
      ),
    );
  }
}
