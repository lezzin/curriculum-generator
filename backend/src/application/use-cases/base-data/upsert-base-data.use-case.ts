import { randomUUID } from "crypto";
import { UpsertBaseDataInput } from "src/application/models/upsert-base-data.input";
import { BaseData } from "src/domain/entities/base-data.entity";
import { BaseDataRepository } from "src/domain/repositories/base-data.repository";
import { BaseDataType } from "src/domain/shared/enums/base-data-type.enum";

export class UpsertBaseDataUseCase {
    constructor(
        private baseDataRepository: BaseDataRepository,
    ) { }

    async execute(body: UpsertBaseDataInput) {
        await this.baseDataRepository.upsert(new BaseData(
            randomUUID(),
            body.description,
            body.userId,
            body.type
        ));
    }
}