import { BaseDataRepository } from 'src/domain/repositories/base-data.repository';
import { BaseDataType } from 'src/domain/enums/base-data-type.enum';

export class RemoveBaseDataUseCase {
  constructor(private baseDataRepository: BaseDataRepository) {}

  async execute(userId: string, type: BaseDataType) {
    await this.baseDataRepository.remove(userId, type);
  }
}
