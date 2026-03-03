import { randomUUID } from 'crypto';
import { UpsertUserConfigInput } from 'src/application/models/input/upsert-user-config.input';
import { UserConfig } from 'src/domain/entities/user.config.entity';
import { UserConfigRepository } from 'src/domain/repositories/user-config.repository';

export class UpsertUserConfigUseCase {
  constructor(private userConfigRepository: UserConfigRepository) {}

  async execute(body: UpsertUserConfigInput) {
    const existing = await this.userConfigRepository.findByUserId(body.userId);

    if (existing) {
      existing.updateLinkedin(body.linkedin);
      existing.updateGithub(body.github);
      existing.updatePortfolio(body.portfolio);
      existing.updateCellphone(body.cellphone);

      await this.userConfigRepository.save(existing);
      return;
    }

    const userConfig = new UserConfig(
      randomUUID(),
      new Date(),
      new Date(),
      body.userId,
      body.linkedin,
      body.github,
      body.portfolio,
      body.cellphone,
    );

    await this.userConfigRepository.save(userConfig);
  }
}
