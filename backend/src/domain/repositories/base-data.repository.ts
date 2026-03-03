import { BaseData } from '../entities/base-data.entity';
import { BaseDataType } from '../shared/enums/base-data-type.enum';

export abstract class BaseDataRepository {
  abstract save(baseData: BaseData): Promise<void>;
  abstract remove(userId: string, type: BaseDataType): Promise<void>;
  abstract getAll(userId: string): Promise<BaseData[]>;
  abstract findByUserAndType(
    userId: string,
    type: BaseDataType,
  ): Promise<BaseData | null>;
}
