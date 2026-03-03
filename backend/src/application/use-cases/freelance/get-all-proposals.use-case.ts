import {
  GetAllProposalsOutput,
  ProposalItemOutput,
} from 'src/application/models/output/get-all-proposals.output';
import { FreelanceProposal } from 'src/domain/entities/freelance-proposal.entity';
import { CacheRepository } from 'src/domain/repositories/cache.repository';
import { FreelanceProposalRepository } from 'src/domain/repositories/freelance-proposal.repository';
import { REMEMBER_FREELANCE_PROPOSALS_CACHE_PREFIX } from 'src/domain/shared/constants/cache.constants';
import { makeCacheKey } from 'src/domain/shared/helpers/cache-key.helper';

export class GetAllProposalsUseCase {
  constructor(
    private readonly freelanceProposalRepository: FreelanceProposalRepository,
    private readonly cache: CacheRepository,
  ) {}

  async execute(userId: string): Promise<GetAllProposalsOutput> {
    const cacheKey = makeCacheKey(
      REMEMBER_FREELANCE_PROPOSALS_CACHE_PREFIX,
      userId,
    );

    return this.cache.remember(cacheKey, 600, async () => {
      const proposals = await this.freelanceProposalRepository.getAll(userId);
      const items = proposals.map(this.toOutput);

      return {
        items,
        total: items.length,
      };
    });
  }

  private toOutput(proposal: FreelanceProposal): ProposalItemOutput {
    return {
      id: proposal.id,
      bidAmount: proposal.bidAmount,
      deliveryDays: proposal.deliveryDays,
      message: proposal.message,
      prompt: proposal.prompt,
      createdAt: proposal.createdAt,
    };
  }
}
