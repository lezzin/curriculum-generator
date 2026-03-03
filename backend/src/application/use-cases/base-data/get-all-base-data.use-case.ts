import { GetAllBaseDataOutput } from 'src/application/models/output/get-all-base-data.output';
import { BaseDataRepository } from 'src/domain/repositories/base-data.repository';

export class GetAllBaseDataUseCase {
  constructor(private baseDataRepository: BaseDataRepository) { }

  async execute(userId: string): Promise<GetAllBaseDataOutput[]> {
    const allBaseData = await this.baseDataRepository.getAll(userId);

    return allBaseData.map(data => ({
      id: data.id,
      description: data.description,
      type: data.type,
      userId: data.userId,
      createdAt: data.createdAt,
    }))
  }
}
