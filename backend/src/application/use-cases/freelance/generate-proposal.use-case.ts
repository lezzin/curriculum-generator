import { ProposalQueue } from "src/application/queues/proposal-queue";

export class GenerateProposalUseCase {
    constructor(
        private readonly proposalQueue: ProposalQueue,
    ) { }

    async execute(solicitation: string, userId: string) {
        await this.proposalQueue.addGenerateProposalJob({
            solicitation,
            userId,
        });

        return { message: "Solicitação enviada para processamento!" };
    }
}