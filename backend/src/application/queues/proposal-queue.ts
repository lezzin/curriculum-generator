export interface ProposalQueue {
    addGenerateProposalJob(data: {
        solicitation: string;
        userId: string;
    }): Promise<void>;
}