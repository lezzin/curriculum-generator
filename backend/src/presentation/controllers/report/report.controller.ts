import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { GetReportsUseCase } from "src/application/use-cases/report/get-reports.use-case";
import { CurrentUser } from "src/infrastructure/auth/current-user.decorator";
import { JwtAuthGuard } from "src/infrastructure/auth/guards/jwt-auth.guard";
import { GetReportsDto, RequestResumeReportDto } from "./report.dto";
import { RequestResumeReportUseCase } from "src/application/use-cases/report/request-resume-report.use-case";

@UseGuards(JwtAuthGuard)
@Controller('report')
export class ReportController {
    constructor(
        private readonly getReportsUseCase: GetReportsUseCase,
        private readonly requestResumeReportUseCase: RequestResumeReportUseCase,
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

    @Post('/resume')
    async requestResume(
        @Req() req: any,
        @CurrentUser('id') userId: string,
        @Body() body: RequestResumeReportDto,
    ) {
        return this.requestResumeReportUseCase.execute({
            clientIp: req.headers['x-forwarded-for'] || req?.socket.remoteAddress,
            hostname: req.hostname,
            userId,
            initialDateCreation: body.initial_date_creation,
            finalDateCreation: body.final_date_creation,
        })
    }
}