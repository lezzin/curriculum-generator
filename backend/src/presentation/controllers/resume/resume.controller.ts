import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { GeneratePdfUseCase } from 'src/application/use-cases/resume/generate-pdf.use-case';
import { GenerateResumeUseCase } from 'src/application/use-cases/resume/generate-resume.use-case';
import { GetAllResumesUseCase } from 'src/application/use-cases/resume/get-all-resumes.use-case';
import { CurrentUser } from 'src/infrastructure/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';
import { GenerateResumeDto } from './resume.dto';

@UseGuards(JwtAuthGuard)
@Controller('/resume')
export class ResumeController {
    constructor(
        private readonly generateResumeUseCase: GenerateResumeUseCase,
        private readonly getAllResumesUseCase: GetAllResumesUseCase,
        private readonly generatePDfUseCase: GeneratePdfUseCase,
    ) { }

    @Post('/generate')
    async generateResume(
        @Body() body: GenerateResumeDto,
        @CurrentUser('id') userId: string
    ) {
        return await this.generateResumeUseCase.execute({ ...body, userId });
    }

    @Get('/all')
    async getAllResumes(@CurrentUser('id') userId: any) {
        return await this.getAllResumesUseCase.getAll(userId);
    }

    @Get('/pdf/:id')
    async getPdfById(
        @Param('id') id: string,
        @Res() res: Response
    ) {
        const stream = await this.generatePDfUseCase.execute(id);

        if (!stream) {
            return null
        }

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${id}.pdf"`,
        });

        stream.pipe(res);
    }
}