import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BasePublisher } from 'src/common/rabbitmq/base.publisher';

@Injectable()
export class FreelancePublisher extends BasePublisher {
  protected exchange = 'freelance.exchange';
  protected routingKey = 'freelance.generate';
  protected queue = 'freelance.queue';

  constructor(readonly configService: ConfigService) {
    super(configService);
  }
}
