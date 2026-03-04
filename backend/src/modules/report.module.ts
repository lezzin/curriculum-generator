import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReportHttpClient } from 'src/infrastructure/http/report/report-http.client';
import { ReportController } from 'src/presentation/controllers/report/report.controller';
import { GenerateReportUseCase } from 'src/application/use-cases/report/generate-report.use-case';

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
            provide: GenerateReportUseCase,
            useFactory: (httpClient: ReportHttpClient) => {
                return new GenerateReportUseCase(httpClient);
            }
        }
    ],
})
export class ReportModule { }