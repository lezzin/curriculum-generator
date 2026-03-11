import { randomUUID } from 'crypto';
import { GenerateProposalInput } from 'src/application/models/input/generate-proposal.input';
import { ProposalItemOutput } from 'src/application/models/output/get-all-proposals.output';
import { FreelanceProposal } from 'src/domain/entities/freelance-proposal.entity';
import { BaseDataRepository } from 'src/domain/repositories/base-data.repository';
import { CacheRepository } from 'src/domain/repositories/cache.repository';
import { FreelanceProposalRepository } from 'src/domain/repositories/freelance-proposal.repository';
import { BaseDataType } from 'src/domain/enums/base-data-type.enum';
import {
  buildFreelanceProposalPrompt,
  FreelanceProposalResponse,
} from 'src/infrastructure/services/gemini/helpers/freelance-proposal.prompt';
import { GeminiService } from 'src/infrastructure/services/gemini/gemini.service';
import { SseRepository } from 'src/domain/repositories/sse.repository';

export class ProposalGenerationUseCase {
  constructor(
    private readonly freelanceProposalRepository: FreelanceProposalRepository,
    private readonly baseDataRepository: BaseDataRepository,
    private readonly geminiService: GeminiService,
    private readonly sseRepository: SseRepository,
    private readonly cache: CacheRepository,
  ) {}

  async execute(body: GenerateProposalInput) {
    const { solicitation, userId } = body;

    const baseData = await this.baseDataRepository.findByUserAndType(
      userId,
      BaseDataType.FREELANCE_PROPOSAL,
    );
    if (!baseData) {
      this.sseRepository.sendEvent(
        userId,
        'message',
        'Ops! Não encontramos informações base para gerar a proposta. Por favor, cadastre seus dados primeiro.',
      );
      return;
    }

    const proposal = await this.cache.rememberByHash(
      solicitation,
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
        new Date(),
      ),
    );

    await this.invalidateCaches(userId, solicitation);
    this.sseRepository.sendEvent<ProposalItemOutput>(
      userId,
      'proposal-generated',
      {
        id: savedProposal.id,
        userId: savedProposal.userId,
        bidAmount: savedProposal.bidAmount,
        deliveryDays: savedProposal.deliveryDays,
        message: savedProposal.message,
        prompt: savedProposal.prompt,
        createdAt: savedProposal.createdAt,
      },
    );

    return savedProposal;
  }

  private async invalidateCaches(userId: string, value: string) {
    await this.cache.invalidateScope('freelance-proposal:all', userId);
    await this.cache.invalidateByHash(value);
  }
}
