import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GenerateResumeUseCase } from 'src/application/use-cases/resume/generate-resume.use-case';
import { GetAllResumesUseCase } from 'src/application/use-cases/resume/get-all-resumes.use-case';
import { ResumeOptions } from 'src/domain/shared/interfaces/resume.interfaces';
import { CurrentUser } from 'src/infrastructure/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/resume')
export class ResumeController {
    constructor(
        private readonly generateResumeUseCase: GenerateResumeUseCase,
        private readonly getAllResumesUseCase: GetAllResumesUseCase,
    ) { }

    @Post('/generate')
    async generateResume(
        @Body() body: { userId: string, jobDescription: string, options: ResumeOptions },
        @CurrentUser('id') userId: string
    ) {
        return await this.generateResumeUseCase.execute(userId,
            body.jobDescription,
            body.options
        );
    }

    @Get('/all')
    async getAllResumes(@CurrentUser('id') userId: any) {
        return await this.getAllResumesUseCase.getAll(userId);
    }
}