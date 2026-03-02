import { GenerateProposalInput } from 'src/application/models/generate-proposal.input';
import { ProposalQueue } from 'src/application/queues/proposal-queue';

export class GenerateProposalUseCase {
  constructor(private readonly proposalQueue: ProposalQueue) {}

  async execute(body: GenerateProposalInput) {
    await this.proposalQueue.addGenerateProposalJob({ ...body });
    return { message: 'Solicitação enviada para processamento!' };
  }
}
