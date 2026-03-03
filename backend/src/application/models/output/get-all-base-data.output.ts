import { BaseDataType } from 'src/domain/shared/enums/base-data-type.enum';

export interface GetAllBaseDataOutput {
  id: string;
  description: string;
  type: BaseDataType;
  userId: string;
  createdAt: Date;
}
