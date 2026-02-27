import { FreelanceProposal } from "../entities/freelance-proposal.entity";

export abstract class FreelanceProposalRepository {
    abstract create(freelanceProposal: FreelanceProposal): Promise<FreelanceProposal>;
    abstract getAll(userId: string): Promise<FreelanceProposal[]>;
}