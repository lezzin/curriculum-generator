import { randomUUID } from "crypto";
import { BaseData } from "src/domain/entities/base-data.entity";
import { BaseDataRepository } from "src/domain/repositories/base-data.repository";
import { BaseDataType } from "src/domain/shared/enums/base-data-type.enum";

export class UpsertBaseDataUseCase {
    constructor(
        private baseDataRepository: BaseDataRepository,
    ) { }

    async execute(userId: string, description: string, type: BaseDataType) {
        await this.baseDataRepository.upsert(new BaseData(
            randomUUID(),
            description,
            userId,
            type
        ));
    }
}