import { GenerateProposalInput } from '../models/input/generate-proposal.input';

export interface ProposalQueue {
  addGenerateProposalJob(data: GenerateProposalInput): Promise<void>;
}
