import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { GenerateProposalInput } from 'src/application/models/input/freelance.input';
import { ProposalGenerationUseCase } from 'src/application/use-cases/freelance/proposal-generation.use-case';
import { WORKER_OPTIONS } from '../constants/queue-config.contants';

@Processor('freelance.queue', WORKER_OPTIONS)
export class FreelanceProcessor extends WorkerHost {
  private readonly logger = new Logger(FreelanceProcessor.name);

  constructor(
    private readonly proposalGenerationUseCase: ProposalGenerationUseCase,
  ) {
    super();
  }

  async process(job: Job<GenerateProposalInput>) {
    return this.proposalGenerationUseCase.execute(job.data);
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(`[${job.queueName}] Job ${job.id} está ativo`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`[${job.queueName}] Job ${job.id} finalizado`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`[${job?.queueName}] Job ${job?.id} falhou`, error.stack);
  }
}
