import { FreelanceService } from '../services/freelance.service';
import { Injectable } from '@nestjs/common';
import { SolicitationDto } from '../dto/freelance.dto';
import { baseFreelance } from 'src/data/base-freelance';
import { BaseConsumer } from 'src/common/rabbitmq/base.consumer';
import { RabbitMQConnection } from 'src/common/rabbitmq/rabbitmq.connection';

@Injectable()
export class FreelanceConsumer extends BaseConsumer {
  protected exchange = 'freelance.exchange';
  protected routingKey = 'freelance.generate';
  protected queue = 'freelance.queue';

  constructor(
    rmq: RabbitMQConnection,
    private readonly freelanceService: FreelanceService,
  ) {
    super(rmq);
  }

  protected async handleMessage(message: SolicitationDto) {
    await this.freelanceService.generateAIProposal(
      baseFreelance,
      message.solicitation,
    );
  }
}
