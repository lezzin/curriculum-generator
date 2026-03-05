import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReportHttpClient } from 'src/infrastructure/http/report/report-http.client';
import { ReportController } from 'src/presentation/controllers/report/report.controller';
import { GetReportsUseCase } from 'src/application/use-cases/report/get-reports.use-case';

@Module({
    imports: [
        HttpModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                baseURL: configService.get<string>('REPORT_URL'),
                timeout: 5000,
            }),
        }),
        ConfigModule,
    ],
    controllers: [ReportController],
    providers: [
        ReportHttpClient,
        {
            inject: [ReportHttpClient],
            provide: GetReportsUseCase,
            useFactory: (httpClient: ReportHttpClient) => {
                return new GetReportsUseCase(httpClient);
            }
        }
    ],
})
export class ReportModule { }