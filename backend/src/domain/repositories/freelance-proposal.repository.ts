import { FreelanceProposal } from "../entities/freelance-proposal.entity";

export abstract class FreelanceProposalRepository {
    abstract create(freelanceProposal: FreelanceProposal): Promise<void>;
    abstract getAll(userId: string): Promise<FreelanceProposal[]>;
}