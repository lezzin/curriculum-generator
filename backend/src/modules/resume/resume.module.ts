import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './services/resume.service';
import { PdfService } from './services/pdf.service';
import { GeminiModule } from '../gemini/gemini.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeEntity } from './entities/resume.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ResumeEntity]),
        GeminiModule,
    ],
    controllers: [ResumeController],
    providers: [ResumeService, PdfService],
})
export class ResumeModule { }
