import { BaseData } from "../entities/base-data.entity";
import { BaseDataType } from "../shared/enums/base-data-type.enum";

export abstract class BaseDataRepository {
    abstract upsert(baseData: BaseData): Promise<void>;
    abstract remove(userId: string, type: BaseDataType): Promise<void>;
    abstract getAll(userId: string): Promise<BaseData[]>;
    abstract findDescriptionByUserAndType(userId: string, type: BaseDataType): Promise<string | null>
}