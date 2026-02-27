import { BaseDataType } from "src/domain/shared/enums/base-data-type.enum"

export interface UpsertBaseDataInput {
    userId: string
    description: string
    type: BaseDataType
}