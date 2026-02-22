import { Body, Controller, Post, Res } from "@nestjs/common";
import { GenerateDto, ResumePdfDto } from "./dto/prompt.dto";
import { baseResume } from "src/data/base-resume";
import { type Response } from 'express';
import { PdfService } from "./services/pdf.service";
import { ResumeService } from "./services/resume.service";

@Controller('/resume')
export class ResumeController {
    constructor(
        private readonly resumeService: ResumeService,
        private readonly pdfService: PdfService,
    ) { }

    @Post('/generate')
    async generateResume(@Body() generateDto: GenerateDto) {
        const { jobDescription, options } = generateDto

        return await this.resumeService.generateAIResume(
            baseResume,
            jobDescription,
            options
        )
    }

    @Post('/pdf/generate')
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