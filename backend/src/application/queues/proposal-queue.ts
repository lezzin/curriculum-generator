import { GenerateProposalInput } from '../models/input/freelance.input';

export interface ProposalQueue {
  addGenerateProposalJob(data: GenerateProposalInput): Promise<void>;
}
