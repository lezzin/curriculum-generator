import { randomUUID } from 'crypto';
import { UpsertBaseDataInput } from 'src/application/models/input/upsert-base-data.input';
import { BaseData } from 'src/domain/entities/base-data.entity';
import { BaseDataRepository } from 'src/domain/repositories/base-data.repository';

export class UpsertBaseDataUseCase {
  constructor(private baseDataRepository: BaseDataRepository) {}

  async execute(input: UpsertBaseDataInput): Promise<void> {
    const existing = await this.baseDataRepository.findByUserAndType(
      input.userId,
      input.type,
    );

    if (existing) {
      existing.updateDescription(input.description);
      await this.baseDataRepository.save(existing);
      return;
    }

    const baseData = new BaseData(
      randomUUID(),
      input.description,
      input.userId,
      input.type,
      new Date(),
    );

    await this.baseDataRepository.save(baseData);
  }
}
