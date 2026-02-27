import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { GetAllBaseDataUseCase } from "src/application/use-cases/base-data/get-all-base-data.use-case";
import { RemoveBaseDataUseCase } from "src/application/use-cases/base-data/remove-base-data.use-case";
import { UpsertBaseDataUseCase } from "src/application/use-cases/base-data/upsert-base-data.use-case";
import { BaseDataType } from "src/domain/shared/enums/base-data-type.enum";
import { CurrentUser } from "src/infrastructure/auth/current-user.decorator";
import { JwtAuthGuard } from "src/infrastructure/auth/jwt-auth.guard";

@Controller('base-data')
export class BaseDataController {
    constructor(
        private readonly upsertBaseDataUseCase: UpsertBaseDataUseCase,
        private readonly removeBaseDataUseCase: RemoveBaseDataUseCase,
        private readonly getAllBaseDataUseCase: GetAllBaseDataUseCase,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('upsert')
    async generate(
        @Body() body: { description: string, type: BaseDataType },
        @CurrentUser('id') userId: string,
    ) {
        await this.upsertBaseDataUseCase.execute(
            userId,
            body.description,
            body.type
        );

        return { message: 'Dado base adicionado/atualizado com sucesso!' };
    }

    @UseGuards(JwtAuthGuard)
    @Post('/remove')
    async remove(
        @Body() body: { type: BaseDataType },
        @CurrentUser('id') userId: string,
    ) {
        return await this.removeBaseDataUseCase.execute(userId, body.type);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/all')
    async getAll(
        @CurrentUser('id') userId: string,
    ) {
        return await this.getAllBaseDataUseCase.execute(userId);
    }
}