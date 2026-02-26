import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { GenerateDto, ResumePdfDto } from './dto/prompt.dto';
import { PdfService } from './services/pdf.service';
import { ResumeService } from './services/resume.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { type Response } from 'express';

@Controller('/resume')
export class ResumeController {
  constructor(
    private readonly resumeService: ResumeService,
    private readonly pdfService: PdfService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post('/generate')
  async generateResume(@Body() generateDto: GenerateDto, @Req() req) {
    const { jobDescription, options } = generateDto;
    const userId = req.user?.id;

    return await this.resumeService.sendResumeToQueue(
      userId,
      jobDescription,
      options,
    );
  }

  @Get('/pdf/:id')
  async generatePdfByUuid(@Param('id') id: string, @Res() res) {
    const stream = await this.pdfService.getPdfById(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${id}.pdf"`,
    });

    stream.pipe(res);
  }

  @Post('/pdf/generate')
  async generatePdf(@Body() resumeDto: ResumePdfDto, @Res() res: Response) {
    const stream = await this.pdfService.generateResumePdf(resumeDto);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="resume.pdf"`,
    });

    res.end(stream)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async getAllResumes(@Req() req) {
    const userId = req.user?.id;
    return await this.resumeService.getResumes(userId);
  }
}
