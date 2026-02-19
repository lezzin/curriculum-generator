import { Module } from '@nestjs/common';
import { GeminiController } from './modules/gemini/gemini.controller';
import { GeminiService } from './modules/gemini/services/gemini.service';
import { ConfigModule } from '@nestjs/config';
import { PdfService } from './modules/gemini/services/pdf.service';

@Module({
  imports: [
    ConfigModule.forRoot()
  ],
  controllers: [GeminiController],
  providers: [GeminiService, PdfService],
})
export class AppModule { }
