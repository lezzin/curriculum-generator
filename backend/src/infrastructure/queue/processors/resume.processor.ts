import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { GenerateResumeInput } from 'src/application/models/input/generate-resume.input';
import { ResumeGenerationUseCase } from 'src/application/use-cases/resume/resume-generation.use-case';

@Processor('resume.queue')
export class ResumeProcessor extends WorkerHost {
  private readonly logger = new Logger(ResumeProcessor.name);

  constructor(
    private readonly resumeGenerationUseCase: ResumeGenerationUseCase,
  ) {
    super();
  }

  async process(job: Job<GenerateResumeInput>) {
    await this.resumeGenerationUseCase.execute(job.data);
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
