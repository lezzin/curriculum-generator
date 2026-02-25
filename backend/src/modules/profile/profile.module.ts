import { Module } from "@nestjs/common";
import { BaseController } from "./base.controller";
import { BaseService } from "./base.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserBaseEntity } from "./entities/user-base.entity";
import { MinioModule } from "../minio/minio.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserBaseEntity]),
        MinioModule,
    ],
    controllers: [BaseController],
    providers: [BaseService]
})
export class ProfileModule { }