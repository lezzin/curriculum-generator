import { Module } from '@nestjs/common';
import { GeminiController } from './gemini.controller';
import { GeminiService } from './services/gemini.service';
import { PdfService } from './services/pdf.service';

@Module({
    controllers: [GeminiController],
    providers: [GeminiService, PdfService],
})
export class GeminiModule { }
