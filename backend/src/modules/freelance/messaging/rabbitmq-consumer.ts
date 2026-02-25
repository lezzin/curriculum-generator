import { FreelanceService } from '../services/freelance.service';
import { Injectable } from '@nestjs/common';
import { SolicitationDto } from '../dto/freelance.dto';
import { BaseConsumer } from 'src/common/rabbitmq/base.consumer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FreelanceConsumer extends BaseConsumer {
  protected exchange = 'freelance.exchange';
  protected routingKey = 'freelance.generate';
  protected queue = 'freelance.queue';

  constructor(
    private readonly freelanceService: FreelanceService,
    readonly configService: ConfigService,
  ) {
    super(configService);
  }

  protected async handleMessage(message: SolicitationDto & { userId: string }): Promise<void> {
    await this.freelanceService.generateAIProposal(
      message.solicitation,
      message.userId,
    );
  }
}
