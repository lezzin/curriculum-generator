import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { FreelanceProposalEntity } from '../entities/freelance-proposal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeminiService } from 'src/modules/gemini/services/gemini.service';
import { SseService } from 'src/modules/sse/sse.service';
import { CacheService } from 'src/modules/cache/cache.service';
import { BaseService } from 'src/modules/profile/base.service';
import { BaseType } from 'src/modules/profile/enum/base-type.enum';
import { build99FreelasProposalPrompt } from '../helpers/freelance.helper';
import { Logger } from '@nestjs/common';
import { MarketplaceProposal } from '../interfaces/freelance.interfaces';
import { CACHE_KEY_PREFIX } from '../constants/freelance.constants';

type JobPayload = {
    solicitation: string
    userId: string
}

@Processor('freelance.queue')
export class FreelanceProcessor extends WorkerHost {
    private readonly logger = new Logger(FreelanceProcessor.name);

    constructor(
        @InjectRepository(FreelanceProposalEntity)
        private readonly freelanceProposalRepository: Repository<FreelanceProposalEntity>,
        private readonly geminiService: GeminiService,
        private readonly sseService: SseService,
        private readonly cacheService: CacheService,
        private readonly baseService: BaseService,
    ) {
        super()
    }

    async process(job: Job<any>) {
        const { solicitation, userId } = job.data as JobPayload;

        const baseData = (await this.baseService.getType(BaseType.FREELANCE_PROPOSAL, userId)).data
        if (!baseData) return;

        const proposal = await this.geminiService.generateJsonResponse<MarketplaceProposal>({
            prompt: build99FreelasProposalPrompt(baseData, solicitation),
            discordData: [
                `**Tipo**: Proposta Freelance`,
                `**Usuário**: ${userId}`,
            ]
        });

        const savedProposal = await this.freelanceProposalRepository.save({
            ...proposal,
            prompt: solicitation,
            userId: userId,
        });

        await this.cacheService.del(`${CACHE_KEY_PREFIX}:${userId}`);

        this.sseService.sendEvent({
            event: 'proposal-generated',
            data: savedProposal,
        });

        return savedProposal;
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