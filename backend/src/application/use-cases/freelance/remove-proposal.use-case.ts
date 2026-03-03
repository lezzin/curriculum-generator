import { FreelanceProposalRepository } from 'src/domain/repositories/freelance-proposal.repository';

export class RemoveProposalUseCase {
  constructor(
    private readonly freelanceProposalRepository: FreelanceProposalRepository,
  ) {}

  async execute(resumeId: string) {
    await this.freelanceProposalRepository.remove(resumeId);
  }
}
