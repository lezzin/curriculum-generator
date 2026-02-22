import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './services/resume.service';
import { PdfService } from './services/pdf.service';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
    imports: [GeminiModule],
    controllers: [ResumeController],
    providers: [ResumeService, PdfService],
})
export class ResumeModule { }
