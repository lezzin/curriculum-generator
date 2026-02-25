import { Injectable } from '@nestjs/common';
import { ResumeService } from '../services/resume.service';
import { GenerateDto } from '../dto/prompt.dto';
import { BaseConsumer } from 'src/common/rabbitmq/base.consumer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResumeConsumer extends BaseConsumer {
  protected exchange = 'resume.exchange';
  protected routingKey = 'resume.generate';
  protected queue = 'resume.queue';

  constructor(
    private readonly resumeService: ResumeService,
    readonly configService: ConfigService,
  ) {
    super(configService);
  }

  protected async handleMessage(message: GenerateDto & { userId: string }) {
    await this.resumeService.generateAIResume(
      message.userId,
      message.jobDescription,
      message.options,
    );
  }
}
