import { randomUUID } from "crypto";
import { GenerateProposalInput } from "src/application/models/generate-proposal.input";
import { FreelanceProposal } from "src/domain/entities/freelance-proposal.entity";
import { BaseDataRepository } from "src/domain/repositories/base-data.repository";
import { CacheRepository } from "src/domain/repositories/cache.repository";
import { FreelanceProposalRepository } from "src/domain/repositories/freelance-proposal.repository";
import { REMEMBER_FREELANCE_PROPOSALS_CACHE_PREFIX } from "src/domain/shared/constants/cache.constants";
import { BaseDataType } from "src/domain/shared/enums/base-data-type.enum";
import { generateHash, makeCacheKey } from "src/domain/shared/helpers/cache-key.helper";
import { build99FreelasProposalPrompt } from "src/domain/shared/helpers/freelance-proposal.prompt";
import { FreelanceProposalInterface } from "src/domain/shared/interfaces/freelance-proposal.interface";
import { GeminiService } from "src/infrastructure/services/gemini.service";
import { SseService } from "src/infrastructure/services/sse.service";

export class ProposalGenerationUseCase {
    constructor(
        private readonly freelanceProposalRepository: FreelanceProposalRepository,
        private readonly baseDataRepository: BaseDataRepository,
        private readonly geminiService: GeminiService,
        private readonly sseService: SseService,
        private readonly cache: CacheRepository,
    ) { }

    async execute(body: GenerateProposalInput) {
        const { solicitation, userId } = body;

        const baseData = await this.baseDataRepository.findDescriptionByUserAndType(userId, BaseDataType.FREELANCE_PROPOSAL)
        if (!baseData) return;

        const promptKey = generateHash(solicitation)

        const proposal = await this.cache.remember(
            promptKey,
            900,
            async () => await this.geminiService.generateJsonResponse<FreelanceProposalInterface>({
                prompt: build99FreelasProposalPrompt(baseData, solicitation),
                discordData: [
                    `**Tipo**: Proposta Freelance`,
                    `**Usuário**: ${userId}`,
                ]
            })
        )

        const savedProposal = await this.freelanceProposalRepository.create(
            new FreelanceProposal(
                randomUUID(),
                solicitation,
                proposal.message,
                proposal.bidAmount,
                proposal.deliveryDays,
                userId
            ))

        await this.invalidateCaches(userId, promptKey)
        this.sseService.sendEvent(userId, 'proposal-generated', savedProposal);

        return savedProposal;
    }

    private async invalidateCaches(userId: string, promptKey: string) {
        await this.cache.del(makeCacheKey(REMEMBER_FREELANCE_PROPOSALS_CACHE_PREFIX, userId));
        await this.cache.del(promptKey);
    }
}