import { Injectable } from '@nestjs/common';
import { BasePublisher } from 'src/common/rabbitmq/base.publisher';
import { RabbitMQConnection } from 'src/common/rabbitmq/rabbitmq.connection';
@Injectable()
export class ResumePublisher extends BasePublisher {
  protected exchange = 'resume.exchange';
  protected routingKey = 'resume.generate';
  protected queue = 'resume.queue';

  constructor(rmq: RabbitMQConnection) {
    super(rmq);
  }
}
