import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { GenerateProposalInput } from 'src/application/models/generate-proposal.input';
import { ProposalQueue } from 'src/application/queues/proposal-queue';

export class BullMQProposalQueue implements ProposalQueue {
  constructor(
    @InjectQueue('freelance.queue')
    private readonly queue: Queue,
  ) {}

  async addGenerateProposalJob(data: GenerateProposalInput): Promise<void> {
    await this.queue.add('generate-proposal', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });
  }
}
