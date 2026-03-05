import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { GetReportsUseCase } from "src/application/use-cases/report/get-reports.use-case";
import { CurrentUser } from "src/infrastructure/auth/current-user.decorator";
import { JwtAuthGuard } from "src/infrastructure/auth/guards/jwt-auth.guard";
import { GetReportsDto } from "./report.dto";

@UseGuards(JwtAuthGuard)
@Controller('report')
export class ReportController {
    constructor(
        private readonly getReportsUseCase: GetReportsUseCase
    ) { }

    @Get('/')
    async getProgresses(
        @CurrentUser('id') userId: string,
        @Query() body: GetReportsDto
    ) {
        return this.getReportsUseCase.execute({
            ...body,
            userId,
            initialDateCreation: body.initial_date_creation,
            finalDateCreation: body.final_date_creation,
        })
    }
}