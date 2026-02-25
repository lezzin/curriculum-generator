import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeminiService } from 'src/modules/gemini/services/gemini.service';
import { SseService } from 'src/modules/sse/sse.service';
import { CacheService } from 'src/modules/cache/cache.service';
import { BaseService } from 'src/modules/profile/base.service';
import { BaseType } from 'src/modules/profile/enum/base-type.enum';
import { Logger } from '@nestjs/common';
import { buildResumePrompt } from '../helpers/resume.helper';
import { Resume } from '../interfaces/resume.interfaces';
import { ResumeEntity } from '../entities/resume.entity';
import { PdfService } from './pdf.service';

@Processor('resume.queue')
export class ResumeProcessor extends WorkerHost {
    private readonly logger = new Logger(ResumeProcessor.name);

    private readonly CACHE_KEY_PREFIX = 'freelance:proposals:all';

    constructor(
        @InjectRepository(ResumeEntity)
        private readonly resumeRepository: Repository<ResumeEntity>,

        private readonly geminiService: GeminiService,
        private readonly sseService: SseService,
        private readonly cacheService: CacheService,
        private readonly pdfService: PdfService,
        private readonly baseService: BaseService,
    ) {
        super()
    }

    async process(job: Job<any>) {
        const { userId, jobDescription, options } = job.data;
        const baseData = (await this.baseService.getType(BaseType.RESUME, userId)).data

        if (!baseData) {
            this.logger.debug(
                `Usuário ${userId} tentou gerar currículo sem configurar dados base.`
            )

            return;
        }

        try {
            const prompt = buildResumePrompt(baseData, jobDescription, options);
            const resume = await this.geminiService.generateJsonResponse<Resume>(prompt);

            const savedResume = await this.resumeRepository.save({
                ...resume,
                prompt: jobDescription,
                userId: userId,
            });

            await this.cacheService.del(`${this.CACHE_KEY_PREFIX}:${userId}`);
            await this.pdfService.generateResumePdfById(savedResume.id);

            this.sseService.sendEvent({
                event: 'resume-generated',
                data: savedResume,
            });

            return savedResume;
        } catch (err) {
            this.logger.error('Failed to generate AI resume flow', err);
            throw err;
        }
    }
}