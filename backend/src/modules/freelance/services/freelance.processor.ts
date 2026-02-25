import { Processor, WorkerHost } from '@nestjs/bullmq'
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
        const { solicitation, userId } = job.data;
        const baseData = (await this.baseService.getType(BaseType.FREELANCE_PROPOSAL, userId)).data

        if (!baseData) {
            this.logger.debug(
                `Usuário ${userId} tentou gerar proposta freelance sem configurar dados base.`
            )

            return;
        }

        try {
            const prompt = build99FreelasProposalPrompt(baseData, solicitation);
            const proposal = await this.geminiService.generateJsonResponse<MarketplaceProposal>(prompt);

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
        } catch (err) {
            this.logger.error('Failed to generate AI proposal flow', err);
            throw err;
        }
    }
}