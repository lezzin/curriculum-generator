import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { GetPdfUseCase } from 'src/application/use-cases/resume/get-pdf.use-case';
import { GenerateResumeUseCase } from 'src/application/use-cases/resume/generate-resume.use-case';
import { GetAllResumesUseCase } from 'src/application/use-cases/resume/get-all-resumes.use-case';
import { CurrentUser } from 'src/infrastructure/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { GenerateResumeDto, GetPageParamsDto } from './resume.dto';
import { GeneratePdfUseCase } from 'src/application/use-cases/resume/generate-pdf.use-case';
import { GetPageUseCase } from 'src/application/use-cases/resume/get-page.use-case';
import { HtmlExceptionFilter } from 'src/infrastructure/http/filters/html-exception.filter';
import { IsPublic } from 'src/infrastructure/auth/is-public.decorator';
import { RemoveResumeUseCase } from 'src/application/use-cases/resume/remove-resume.use-case';
import { PaginateDto } from 'src/presentation/dto/paginate.dto';

@UseGuards(JwtAuthGuard)
@Controller('/resume')
export class ResumeController {
  constructor(
    private readonly generateResumeUseCase: GenerateResumeUseCase,
    private readonly getAllResumesUseCase: GetAllResumesUseCase,
    private readonly removeResumeUseCase: RemoveResumeUseCase,
    private readonly getPdfUseCase: GetPdfUseCase,
    private readonly getPageUseCase: GetPageUseCase,
    private readonly generatePdfUseCase: GeneratePdfUseCase,
  ) { }

  @Post('/generate')
  @HttpCode(HttpStatus.ACCEPTED)
  async generateResume(
    @CurrentUser('id') userId: string,
    @Body() body: GenerateResumeDto,
  ) {
    await this.generateResumeUseCase.execute({ ...body, userId });
  }

  @Post('/remove')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentUser('id') userId: string,
    @Body() body: { resume_id: string }
  ) {
    await this.removeResumeUseCase.execute({
      resumeId: body.resume_id,
      userId
    });
  }

  @Get('/all')
  async getAllResumes(
    @CurrentUser('id') userId: any,
    @Query() query: PaginateDto
  ) {
    return await this.getAllResumesUseCase.execute({ ...query, userId });
  }

  @Get('/pdf/:id')
  @UseFilters(HtmlExceptionFilter)
  async getPdfById(@Param('id') id: string, @Res() res: Response) {
    const stream = await this.getPdfUseCase.execute(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${id}.pdf"`,
    });

    stream.pipe(res);
  }

  @IsPublic()
  @UseFilters(HtmlExceptionFilter)
  @Get('/page/:id/:template')
  @Header('Content-Type', 'text/html')
  async getPageById(@Param() params: GetPageParamsDto) {
    return await this.getPageUseCase.execute(params);
  }

  @Post('/pdf/generate')
  async generatePdf(
    @Body() body: any,
    @CurrentUser('id') userId: string,
    @Res() res: Response,
  ) {
    const buffer = await this.generatePdfUseCase.execute({ ...body, userId });

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="resume.pdf"`,
    });

    res.end(buffer);
  }
}
