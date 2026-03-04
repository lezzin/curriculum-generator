import { BaseDataType } from 'src/domain/enums/base-data-type.enum';

export interface GetAllBaseDataOutput {
  id: string;
  description: string;
  type: BaseDataType;
  userId: string;
  createdAt: Date;
}
