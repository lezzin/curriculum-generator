import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { GenerateDto } from './dto/prompt.dto';
import { baseResume } from 'src/data/base-resume';
import { PdfService } from './services/pdf.service';
import { ResumeService } from './services/resume.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
      baseResume,
      userId,
      jobDescription,
      options,
    );
  }

  @Get('/pdf/:id')
  async generatePdfByUuid(@Param('id') id: string) {
    return await this.pdfService.generateResumePdfById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async getAllResumes(@Req() req) {
    const userId = req.user?.id;
    return await this.resumeService.getResumes(userId);
  }
}
