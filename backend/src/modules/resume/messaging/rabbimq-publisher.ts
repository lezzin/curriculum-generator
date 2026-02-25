import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BasePublisher } from 'src/common/rabbitmq/base.publisher';

@Injectable()
export class ResumePublisher extends BasePublisher {
  protected exchange = 'resume.exchange';
  protected routingKey = 'resume.generate';
  protected queue = 'resume.queue';

  constructor(readonly configService: ConfigService) {
    super(configService);
  }
}
