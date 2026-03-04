import {
  GetAllProposalsOutput,
  ProposalItemOutput,
} from 'src/application/models/output/get-all-proposals.output';
import { FreelanceProposal } from 'src/domain/entities/freelance-proposal.entity';
import { CacheRepository } from 'src/domain/repositories/cache.repository';
import { FreelanceProposalRepository } from 'src/domain/repositories/freelance-proposal.repository';

export class GetAllProposalsUseCase {
  constructor(
    private readonly freelanceProposalRepository: FreelanceProposalRepository,
    private readonly cache: CacheRepository,
  ) { }

  async execute(userId: string): Promise<GetAllProposalsOutput> {
    return this.cache.rememberByScope(
      'freelance-proposal:all',
      userId,
      5,
      async () => {
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
      userId: proposal.userId,
      bidAmount: proposal.bidAmount,
      deliveryDays: proposal.deliveryDays,
      message: proposal.message,
      prompt: proposal.prompt,
      createdAt: proposal.createdAt,
    };
  }
}
