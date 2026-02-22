import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiModule } from './modules/gemini/gemini.module';
import { FreelanceModule } from './modules/freelance/freelance.module';
import { ResumeModule } from './modules/resume/resume.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GeminiModule,
    FreelanceModule,
    ResumeModule,
  ],
})
export class AppModule { }
