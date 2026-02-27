import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { GetByUserIdUserConfigUseCase } from "src/application/use-cases/user-config/get-by-user-id.use-case";
import { UpsertUserConfigUseCase } from "src/application/use-cases/user-config/upsert.use-case";
import { CurrentUser } from "src/infrastructure/auth/current-user.decorator";
import { JwtAuthGuard } from "src/infrastructure/auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('user-config')
export class UserConfigController {
    constructor(
        private readonly upsertUserConfigUseCase: UpsertUserConfigUseCase,
        private readonly getByUserIdUserConfigUseCase: GetByUserIdUserConfigUseCase,
    ) { }

    @Post('upsert')
    async generate(
        @Body() body: {
            userId: string,
            linkedin?: string,
            github?: string,
            portfolio?: string,
            cellphone?: string,
        },
        @CurrentUser('id') userId: string,
    ) {
        await this.upsertUserConfigUseCase.execute(
            userId,
            body.linkedin,
            body.github,
            body.portfolio,
            body.cellphone
        );

        return { message: 'Dados de configuração adicionados/atualizados com sucesso!' };
    }

    @Get('all')
    async getAll(
        @CurrentUser('id') userId: string,
    ) {
        return await this.getByUserIdUserConfigUseCase.execute(userId);
    }
}