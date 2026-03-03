import { BaseDataType } from '../shared/enums/base-data-type.enum';

export class BaseData {
  constructor(
    public readonly id: string,
    public description: string,
    public userId: string,
    public type: BaseDataType,
    public readonly createdAt: Date,
  ) {}

  updateDescription(description: string) {
    this.description = description;
  }
}
