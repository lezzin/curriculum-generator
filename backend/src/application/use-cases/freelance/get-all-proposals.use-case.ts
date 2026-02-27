import { FreelanceProposalRepository } from "src/domain/repositories/freelance-proposal.repository";

export class GetAllProposalsUseCase {
    constructor(
        private readonly freelanceProposalRepository: FreelanceProposalRepository
    ) { }

    async getAll(userId: string) {
        return await this.freelanceProposalRepository.getAll(userId);
    }
}