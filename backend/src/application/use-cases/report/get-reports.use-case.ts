import { GetReportsInput } from "src/application/models/input/get-reports.input";
import { ReportHttpClient } from "src/infrastructure/http/report/report-http.client";

export class GetReportsUseCase {
    constructor(
        private readonly reportHtpClient: ReportHttpClient
    ) { }

    async execute(body: GetReportsInput) {
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