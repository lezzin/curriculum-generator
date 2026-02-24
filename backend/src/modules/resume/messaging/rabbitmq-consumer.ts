import { Injectable } from '@nestjs/common';
import { ResumeService } from '../services/resume.service';
import { GenerateDto } from '../dto/prompt.dto';
import { baseResume } from 'src/data/base-resume';
import { BaseConsumer } from 'src/common/rabbitmq/base.consumer';
import { RabbitMQConnection } from 'src/common/rabbitmq/rabbitmq.connection';

@Injectable()
export class ResumeConsumer extends BaseConsumer {
  protected exchange = 'resume.exchange';
  protected routingKey = 'resume.generate';
  protected queue = 'resume.queue';

  constructor(
    rmq: RabbitMQConnection,
    private readonly resumeService: ResumeService,
  ) {
    super(rmq);
  }

  protected async handleMessage(message: GenerateDto & { userId: string }) {
    await this.resumeService.generateAIResume(
      baseResume,
      message.userId,
      message.jobDescription,
      message.options,
    );
  }
}
