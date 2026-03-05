import { GetReportsInput } from "src/application/models/input/get-reports.input";
import { RequestResumeReportInput } from "src/application/models/input/request-resume-report.input";
import { ReportHttpClient } from "src/infrastructure/http/report/report-http.client";

export class RequestResumeReportUseCase {
    constructor(
        private readonly reportHtpClient: ReportHttpClient
    ) { }

    async execute(body: RequestResumeReportInput) {
        return await this.reportHtpClient.request({
            method: 'post',
            path: '/resume-generation',
            params: {
                client_ip: body.clientIp,
                host_name: body.hostname,
                user_uuid: body.userId,
                initial_date_creation: body.initialDateCreation,
                final_date_creation: body.finalDateCreation,
            }
        })
    }
}