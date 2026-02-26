import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
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
import { CACHE_KEY_PREFIX } from '../constants/resume.constants';
import { ResumeOptionsDto, ResumePdfDto } from '../dto/prompt.dto';

type JobPayload = {
    userId: string
    jobDescription: string
    options: ResumeOptionsDto
}

@Processor('resume.queue')
export class ResumeProcessor extends WorkerHost {
    private readonly logger = new Logger(ResumeProcessor.name);

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

    async process(job: Job<JobPayload>) {
        const { userId, jobDescription, options } = job.data;

        const baseData = (await this.baseService.getType(BaseType.RESUME, userId)).data;
        if (!baseData) return;

        const resume = await this.geminiService.generateJsonResponse<Resume>({
            prompt: buildResumePrompt(baseData, jobDescription, options),
            discordData: [
                `**Tipo**: Currículo`,
                `**Usuário**: ${userId}`,
            ]
        });

        const savedResume = await this.resumeRepository.save({
            ...resume,
            prompt: jobDescription,
            userId,
            template: options.template
        }) as ResumePdfDto & { id: string };

        await this.cacheService.del(`${CACHE_KEY_PREFIX}:${userId}`);
        await this.pdfService.generateResumePdfByEntity(savedResume);

        this.sseService.sendEvent({
            event: 'resume-generated',
            data: savedResume,
        });

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