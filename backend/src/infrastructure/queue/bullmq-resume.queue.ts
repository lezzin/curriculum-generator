import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { GenerateResumeInput } from 'src/application/models/input/generate-resume.input';
import { ResumeQueue } from 'src/application/queues/resume-queue';

export class BullMQResumeQueue implements ResumeQueue {
  constructor(
    @InjectQueue('resume.queue')
    private readonly queue: Queue,
  ) { }

  async addGenerateResumeJob(data: GenerateResumeInput): Promise<void> {
    await this.queue.add('generate-resume', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });
  }
}
