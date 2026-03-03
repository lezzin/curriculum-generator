import { randomUUID } from 'crypto';
import { GenerateProposalInput } from 'src/application/models/input/generate-proposal.input';
import { ProposalItemOutput } from 'src/application/models/output/get-all-proposals.output';
import { FreelanceProposal } from 'src/domain/entities/freelance-proposal.entity';
import { BaseDataRepository } from 'src/domain/repositories/base-data.repository';
import { CacheRepository } from 'src/domain/repositories/cache.repository';
import { FreelanceProposalRepository } from 'src/domain/repositories/freelance-proposal.repository';
import { REMEMBER_FREELANCE_PROPOSALS_CACHE_PREFIX } from 'src/domain/shared/constants/cache.constants';
import { BaseDataType } from 'src/domain/shared/enums/base-data-type.enum';
import {
  generateHash,
  makeCacheKey,
} from 'src/domain/shared/helpers/cache-key.helper';
import { buildFreelanceProposalPrompt, FreelanceProposalResponse } from 'src/infrastructure/services/gemini/helpers/freelance-proposal.prompt';
import { SseService } from 'src/infrastructure/services/sse.service';
import { GeminiService } from 'src/infrastructure/services/gemini/gemini.service';

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

    const baseData = await this.baseDataRepository.findByUserAndType(
      userId,
      BaseDataType.FREELANCE_PROPOSAL,
    );
    if (!baseData) {
      this.sseService.sendEvent(
        userId,
        'message',
        'Ops! Não encontramos informações base para gerar a proposta. Por favor, cadastre seus dados primeiro.',
      );
      return;
    }

    const promptKey = generateHash(solicitation);

    const proposal = await this.cache.remember(
      promptKey,
      900,
      async () =>
        await this.geminiService.generateJsonResponse<FreelanceProposalResponse>(
          {
            prompt: buildFreelanceProposalPrompt(baseData, solicitation),
            discordData: [
              `**Tipo**: Proposta Freelance`,
              `**Usuário**: ${userId}`,
            ],
          },
        ),
    );

    const savedProposal = await this.freelanceProposalRepository.create(
      new FreelanceProposal(
        randomUUID(),
        solicitation,
        proposal.message,
        proposal.bidAmount,
        proposal.deliveryDays,
        userId,
        new Date()
      ),
    );

    await this.invalidateCaches(userId, promptKey);
    this.sseService.sendEvent<ProposalItemOutput>(userId, 'proposal-generated', {
      id: savedProposal.id,
      bidAmount: savedProposal.bidAmount,
      deliveryDays: savedProposal.deliveryDays,
      message: savedProposal.message,
      prompt: savedProposal.prompt,
      createdAt: savedProposal.createdAt
    });

    return savedProposal;
  }

  private async invalidateCaches(userId: string, promptKey: string) {
    await this.cache.del(
      makeCacheKey(REMEMBER_FREELANCE_PROPOSALS_CACHE_PREFIX, userId),
    );
    await this.cache.del(promptKey);
  }
}
