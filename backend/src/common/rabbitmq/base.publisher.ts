import { Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Channel, ChannelModel, connect } from 'amqplib';

export abstract class BasePublisher implements OnModuleInit {
  protected abstract exchange: string;
  protected abstract routingKey: string;
  protected abstract queue: string;

  private connection: ChannelModel;
  protected channel: Channel;

  protected readonly logger = new Logger(this.constructor.name);

  constructor(readonly configService: ConfigService) { }

  async onModuleInit() {
    await this.setupInfrastructure();
  }

  private async setupInfrastructure() {
    const user = this.configService.get<string>('RABBITMQ_USER');
    const password = this.configService.get<string>('RABBITMQ_PASSWORD');
    const url = this.configService.get<string>('RABBITMQ_URL');

    this.connection = await connect(`amqp://${user}:${password}@${url}`);
    this.channel = await this.connection.createChannel();

    await this.channel.assertExchange(this.exchange, 'direct', {
      durable: true,
    });

    await this.channel.assertQueue(this.queue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': `${this.exchange}.dlx`,
      },
    });

    await this.channel.bindQueue(this.queue, this.exchange, this.routingKey);

    this.logger.log(`✅ Publisher ready (${this.exchange})`);
  }

  async publish(message: unknown): Promise<void> {
    try {
      const payload = Buffer.from(JSON.stringify(message));

      this.channel.publish(this.exchange, this.routingKey, payload, {
        persistent: true,
      });

      this.logger.debug(`📤 Message published to ${this.exchange}`);
    } catch (error) {
      this.logger.error('❌ Publish failed', error);
      throw error;
    }
  }
}
