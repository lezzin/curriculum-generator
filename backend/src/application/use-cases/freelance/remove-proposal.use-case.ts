import { RemoveProposalInput } from 'src/application/models/input/remove-proposal.input';
import { CacheRepository } from 'src/domain/repositories/cache.repository';
import { FreelanceProposalRepository } from 'src/domain/repositories/freelance-proposal.repository';

export class RemoveProposalUseCase {
  constructor(
    private readonly freelanceProposalRepository: FreelanceProposalRepository,
    private readonly cache: CacheRepository,
  ) { }

  async execute(body: RemoveProposalInput) {
    await this.freelanceProposalRepository.remove(body.proposalId);
    await this.cache.invalidateScope('freelance-proposal:all', body.userId);
  }
}
