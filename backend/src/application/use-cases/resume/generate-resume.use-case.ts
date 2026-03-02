import { GenerateResumeInput } from 'src/application/models/generate-resume.input';
import { ResumeQueue } from 'src/application/queues/resume-queue';

export class GenerateResumeUseCase {
  constructor(private readonly resumeQueue: ResumeQueue) {}

  async execute(body: GenerateResumeInput) {
    await this.resumeQueue.addGenerateResumeJob({ ...body });
    return { message: 'Solicitação enviada para processamento!' };
  }
}
