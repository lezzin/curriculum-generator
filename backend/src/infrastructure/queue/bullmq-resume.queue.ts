import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { GenerateResumeInput } from 'src/application/models/input/resume.input';
import { ResumeQueue } from 'src/application/queues/resume-queue';
import { JOB_OPTIONS } from './constants/queue-config.contants';

export class BullMQResumeQueue implements ResumeQueue {
  constructor(
    @InjectQueue('resume.queue')
    private readonly queue: Queue,
  ) { }

  async addGenerateResumeJob(data: GenerateResumeInput): Promise<void> {
    await this.queue.add('generate-resume', data, JOB_OPTIONS);
  }
}
