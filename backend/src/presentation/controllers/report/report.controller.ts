import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { GenerateReportUseCase } from "src/application/use-cases/report/generate-report.use-case";
import { CurrentUser } from "src/infrastructure/auth/current-user.decorator";
import { GenerateReportDto } from "./report.dto";
import { JwtAuthGuard } from "src/infrastructure/auth/guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('report')
export class ReportController {
    constructor(
        private readonly generateReportUseCase: GenerateReportUseCase
    ) { }

    @Get('resume')
    async getProgresses(
        @CurrentUser('id') userId: string,
        @Query() body: GenerateReportDto
    ) {
        return this.generateReportUseCase.execute({
            ...body,
            userId,
            initialDateCreation: body.initial_date_creation,
            finalDateCreation: body.final_date_creation,
        })
    }
}