import { BaseData } from 'src/domain/entities/base-data.entity';
import { BaseDataRepository } from 'src/domain/repositories/base-data.repository';

export class GetAllBaseDataUseCase {
  constructor(private baseDataRepository: BaseDataRepository) {}

  async execute(userId: string): Promise<BaseData[]> {
    return await this.baseDataRepository.getAll(userId);
  }
}
