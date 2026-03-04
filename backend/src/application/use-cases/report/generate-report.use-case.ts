import { GenerateReportInput } from "src/application/models/input/generate-report.input";
import { ReportHttpClient } from "src/infrastructure/http/report/report-http.client";

export class GenerateReportUseCase {
    constructor(
        private readonly reportHtpClient: ReportHttpClient
    ) { }

    async execute(body: GenerateReportInput) {
        return await this.reportHtpClient.request({
            method: 'get',
            path: '/report',
            params: {
                page: body.page,
                limit: body.limit,
                user_uuid: body.userId,
                initial_date_creation: body.initialDateCreation,
                final_date_creation: body.finalDateCreation,
            }
        })
    }
}