import { GenerateProposalInput } from "../models/generate-proposal.input";

export interface ProposalQueue {
    addGenerateProposalJob(data: GenerateProposalInput): Promise<void>;
}