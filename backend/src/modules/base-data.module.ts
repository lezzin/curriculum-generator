import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseDataEntity } from 'src/infrastructure/database/entities/base-data.entity';
import { BaseDataRepository } from 'src/domain/repositories/base-data.repository';
import { TypeOrmBaseDataRepository } from 'src/infrastructure/database/repositories/base-data.repository';
import { UpsertBaseDataUseCase } from 'src/application/use-cases/base-data/upsert-base-data.use-case';
import { BaseDataController } from 'src/presentation/controllers/base-data/base-data.controller';
import { RemoveBaseDataUseCase } from 'src/application/use-cases/base-data/remove-base-data.use-case';
import { GetAllBaseDataUseCase } from 'src/application/use-cases/base-data/get-all-base-data.use-case';

@Module({
    imports: [TypeOrmModule.forFeature([BaseDataEntity])],
    controllers: [BaseDataController],
    providers: [
        {
            provide: BaseDataRepository,
            useClass: TypeOrmBaseDataRepository,
        },
        {
            provide: UpsertBaseDataUseCase,
            useFactory: (
                baseDataRepository: BaseDataRepository,
            ) => {
                return new UpsertBaseDataUseCase(baseDataRepository);
            },
            inject: [BaseDataRepository],
        },
        {
            provide: RemoveBaseDataUseCase,
            useFactory: (
                baseDataRepository: BaseDataRepository,
            ) => {
                return new RemoveBaseDataUseCase(baseDataRepository);
            },
            inject: [BaseDataRepository],
        },
        {
            provide: GetAllBaseDataUseCase,
            useFactory: (
                baseDataRepository: BaseDataRepository,
            ) => {
                return new GetAllBaseDataUseCase(baseDataRepository);
            },
            inject: [BaseDataRepository],
        },
    ],
    exports: [BaseDataRepository],
})
export class BaseDataModule { }