import { GetByUserIdUserConfigOutput } from 'src/application/models/output/get-by-user-id-user-config.output';
import { UserConfigRepository } from 'src/domain/repositories/user-config.repository';

export class GetByUserIdUserConfigUseCase {
  constructor(private userConfigRepository: UserConfigRepository) {}

  async execute(userId: string): Promise<GetByUserIdUserConfigOutput | null> {
    const userConfigData = await this.userConfigRepository.findByUserId(userId);

    if (!userConfigData) {
      return null;
    }

    return {
      id: userConfigData.id,
      userId: userConfigData.userId,
      cellphone: userConfigData?.cellphone,
      github: userConfigData?.github,
      linkedin: userConfigData?.linkedin,
      portfolio: userConfigData?.portfolio,
    };
  }
}
