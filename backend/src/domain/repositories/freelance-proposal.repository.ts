import { FreelanceProposal } from '../entities/freelance-proposal.entity';
import { PaginatedResult } from '../interfaces/paginate.interfaces';


export abstract class FreelanceProposalRepository {
  abstract create(
    freelanceProposal: FreelanceProposal,
  ): Promise<FreelanceProposal>;

  abstract paginate(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResult<FreelanceProposal>>

  abstract remove(proposalId: string): Promise<void>;
}
