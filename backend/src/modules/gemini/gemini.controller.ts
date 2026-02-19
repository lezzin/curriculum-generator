import { Body, Controller, Post, Res } from "@nestjs/common";
import { GenerateDto, ResumePdfDto } from "./dto/prompt.dto";
import { GeminiService } from "./services/gemini.service";
import { baseResume } from "src/data/base-resume";
import { PdfService } from "./services/pdf.service";
import { type Response } from 'express';

@Controller('/gemini')
export class GeminiController {
    constructor(
        private readonly geminiService: GeminiService,
        private readonly pdfService: PdfService,
    ) { }

    @Post('/generate-resume')
    async generateResume(@Body() generateDto: GenerateDto) {
        const { jobDescription, options } = generateDto

        return await this.geminiService.generateAIResume(
            baseResume,
            jobDescription,
            options
        )
    }

    @Post('/generate-pdf')
    async generatePdf(
        @Body() resumePdfDto: ResumePdfDto,
        @Res() res: Response,
    ) {
        const pdfBuffer = await this.pdfService.generateResumePdf(resumePdfDto);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=resume.pdf',
            'Content-Length': pdfBuffer.length,
        });

        res.end(pdfBuffer);
    }
}