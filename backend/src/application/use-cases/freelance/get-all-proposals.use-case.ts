import { PaginateInput } from 'src/application/models/input/paginate.input';
import { ProposalItemOutput } from 'src/application/models/output/get-all-proposals.output';
import { FreelanceProposal } from 'src/domain/entities/freelance-proposal.entity';
import { PaginatedResult } from 'src/domain/interfaces/paginate.interfaces';
import { FreelanceProposalRepository } from 'src/domain/repositories/freelance-proposal.repository';

export class GetAllProposalsUseCase {
  constructor(
    private readonly freelanceProposalRepository: FreelanceProposalRepository,
  ) { }

  async execute(body: PaginateInput): Promise<PaginatedResult<ProposalItemOutput>> {
    const proposals = await this.freelanceProposalRepository.paginate(body.userId, body.page, body.limit);

    return {
      ...proposals,
      data: proposals.data.map(this.toOutput)
    };
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
