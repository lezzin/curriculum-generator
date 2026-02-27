import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { Logger } from '@nestjs/common';
import { BaseDataType } from 'src/domain/shared/enums/base-data-type.enum';
import { FreelanceProposalRepository } from 'src/domain/repositories/freelance-proposal.repository';
import { FreelanceProposalInterface } from 'src/domain/shared/interfaces/freelance-proposal.interface';
import { build99FreelasProposalPrompt } from 'src/domain/shared/helpers/freelance-proposal.prompt';
import { GeminiService } from 'src/infrastructure/services/gemini.service';
import { BaseDataRepository } from 'src/domain/repositories/base-data.repository';
import { FreelanceProposal } from 'src/domain/entities/freelance-proposal.entity';
import { randomUUID } from 'crypto';
import { SseService } from 'src/infrastructure/services/sse.service';

@Processor('freelance.queue')
export class FreelanceProcessor extends WorkerHost {
    private readonly logger = new Logger(FreelanceProcessor.name);

    constructor(
        private readonly freelanceProposalRepository: FreelanceProposalRepository,
        private readonly baseDataRepository: BaseDataRepository,
        private readonly geminiService: GeminiService,
        private readonly sseService: SseService,
    ) {
        super()
    }

    async process(job: Job<any>) {
        const { solicitation, userId } = job.data as { solicitation: string, userId: string };

        const baseData = await this.baseDataRepository.findDescriptionByUserAndType(userId, BaseDataType.FREELANCE_PROPOSAL)
        if (!baseData) return;

        const proposal = await this.geminiService.generateJsonResponse<FreelanceProposalInterface>({
            prompt: build99FreelasProposalPrompt(baseData, solicitation),
            discordData: [
                `**Tipo**: Proposta Freelance`,
                `**Usuário**: ${userId}`,
            ]
        });

        const savedProposal = await this.freelanceProposalRepository.create(
            new FreelanceProposal(
                randomUUID(),
                solicitation,
                proposal.message,
                proposal.bidAmount,
                proposal.deliveryDays,
                userId
            ))

        this.sseService.sendEvent(userId, 'proposal-generated', savedProposal);

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