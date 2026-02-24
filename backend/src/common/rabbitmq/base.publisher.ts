import { Logger, OnModuleInit } from '@nestjs/common';
import { Channel } from 'amqplib';
import { RabbitMQConnection } from './rabbitmq.connection';

export abstract class BasePublisher implements OnModuleInit {
  protected abstract exchange: string;
  protected abstract routingKey: string;
  protected abstract queue: string;

  protected channel: Channel;
  protected readonly logger = new Logger(this.constructor.name);

  constructor(protected readonly rmq: RabbitMQConnection) {}

  async onModuleInit() {
    this.channel = await this.rmq.getChannel();
    await this.setupInfrastructure();
  }

  private async setupInfrastructure() {
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

      if (!this.channel) {
        this.channel = await this.rmq.getChannel();
      }

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
