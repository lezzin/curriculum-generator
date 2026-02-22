import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiModule } from './modules/gemini/gemini.module';
import { FreelanceModule } from './modules/freelance/freelance.module';
import { ResumeModule } from './modules/resume/resume.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GeminiModule,
    FreelanceModule,
    ResumeModule,
    HealthModule,
  ],
})
export class AppModule { }
