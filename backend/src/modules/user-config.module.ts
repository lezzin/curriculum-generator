import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserConfigEntity } from 'src/infrastructure/database/entities/user-config.entity';
import { UserConfigController } from 'src/presentation/controllers/user-config/user-config.controller';
import { UserConfigRepository } from 'src/domain/repositories/user-config.repository';
import { TypeOrmUserConfigRepository } from 'src/infrastructure/database/repositories/user-config.repository';
import { UpsertUserConfigUseCase } from 'src/application/use-cases/user-config/upsert.use-case';
import { GetByUserIdUserConfigUseCase } from 'src/application/use-cases/user-config/get-by-user-id.use-case';

@Module({
    imports: [TypeOrmModule.forFeature([UserConfigEntity])],
    controllers: [UserConfigController],
    providers: [
        {
            provide: UserConfigRepository,
            useClass: TypeOrmUserConfigRepository,
        },
        {
            provide: UpsertUserConfigUseCase,
            useFactory: (
                userConfigRepository: UserConfigRepository,
            ) => {
                return new UpsertUserConfigUseCase(userConfigRepository);
            },
            inject: [UserConfigRepository],
        },
        {
            provide: GetByUserIdUserConfigUseCase,
            useFactory: (
                userConfigRepository: UserConfigRepository,
            ) => {
                return new GetByUserIdUserConfigUseCase(userConfigRepository);
            },
            inject: [UserConfigRepository],
        },
    ],
    exports: [UserConfigRepository],
})
export class UserConfigModule { }