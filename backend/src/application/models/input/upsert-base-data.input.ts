import { BaseDataType } from 'src/domain/enums/base-data-type.enum';

export interface UpsertBaseDataInput {
  userId: string;
  description: string;
  type: BaseDataType;
}
