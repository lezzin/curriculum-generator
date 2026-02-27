import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { Logger } from '@nestjs/common';
import { GeminiService } from 'src/infrastructure/services/gemini.service';
import { BaseDataRepository } from 'src/domain/repositories/base-data.repository';
import { ResumeRepository } from 'src/domain/repositories/resume.repository';
import { Resume } from 'src/domain/entities/resume.entity';
import { ResumeOptions } from 'src/domain/shared/interfaces/resume.interfaces';
import { BaseDataType } from 'src/domain/shared/enums/base-data-type.enum';
import { buildResumePrompt } from 'src/domain/shared/helpers/resume-prompt.helper';
import { randomUUID } from 'crypto';
import { PdfService } from 'src/infrastructure/services/pdf.service';
import { SseService } from 'src/infrastructure/services/sse.service';
import { CacheRepository } from 'src/domain/repositories/cache.repository';
import { makeCacheKey } from 'src/domain/shared/helpers/cache-key.helper';
import { REMEMBER_FREELANCE_PROPOSALS_CACHE_PREFIX, REMEMBER_RESUMES_CACHE_PREFIX } from 'src/domain/shared/constants/cache.constants';
import { GenerateResumeInput } from 'src/application/models/generate-resume.input';
import { SelectedTemplate } from 'src/domain/shared/enums/resume.enums';

@Processor('resume.queue')
export class ResumeProcessor extends WorkerHost {
    private readonly logger = new Logger(ResumeProcessor.name);

    constructor(
        private readonly resumeRepository: ResumeRepository,
        private readonly baseDataRepository: BaseDataRepository,
        private readonly geminiService: GeminiService,
        private readonly pdfService: PdfService,
        private readonly sseService: SseService,
        private readonly cache: CacheRepository,
    ) {
        super()
    }

    async process(job: Job<any>) {
        const { userId, jobDescription, options } = job.data as GenerateResumeInput;

        const baseData = await this.baseDataRepository.findDescriptionByUserAndType(userId, BaseDataType.RESUME)
        if (!baseData) return;

        const resume = await this.geminiService.generateJsonResponse<Resume>({
            prompt: buildResumePrompt(baseData, jobDescription, options),
            discordData: [
                `**Tipo**: Currículo`,
                `**Usuário**: ${userId}`,
            ]
        });

        const savedResume = await this.resumeRepository.create(new Resume(
            randomUUID(),
            jobDescription,
            resume.name,
            resume.language,
            resume.role,
            resume.summary,
            options.template ?? SelectedTemplate.DEFAULT,
            resume.skills,
            resume.experiences,
            resume.projects,
            userId
        ))

        await this.cache.del(makeCacheKey(REMEMBER_RESUMES_CACHE_PREFIX, userId))
        await this.pdfService.generateResumePdfByEntity(savedResume);
        this.sseService.sendEvent(userId, 'resume-generated', savedResume);

        return savedResume;
    }

    @OnWorkerEvent('active')
    onActive(job: Job) {
        this.logger.log(`[${job.queueName}] Job ${job.id} está ativo`);
    }

    @OnWorkerEvent('completed')
    onCompleted(job: Job) {
        this.logger.log(`[${job.queueName}] Job ${job.id} finalizado`);
    }

    @OnWorkerEvent('failed')
    onFailed(job: Job, error: Error) {
        this.logger.error(`[${job?.queueName}] Job ${job?.id} falhou`, error.stack);
    }
}