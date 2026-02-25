import { Logger, OnModuleInit } from '@nestjs/common';
import { Channel, ChannelModel, connect, ConsumeMessage } from 'amqplib';
import { ConfigService } from '@nestjs/config';

export abstract class BaseConsumer implements OnModuleInit {
  protected abstract exchange: string;
  protected abstract routingKey: string;
  protected abstract queue: string;

  private connection: ChannelModel;
  protected channel: Channel;

  protected readonly PREFETCH = 10;
  protected readonly MAX_RETRIES = 5;

  protected readonly logger = new Logger(this.constructor.name);

  constructor(readonly configService: ConfigService) { }

  async onModuleInit() {
    const user = this.configService.get<string>('RABBITMQ_USER');
    const password = this.configService.get<string>('RABBITMQ_PASSWORD');
    const url = this.configService.get<string>('RABBITMQ_URL');

    this.connection = await connect(`amqp://${user}:${password}@${url}`);
    this.channel = await this.connection.createChannel();

    await this.channel.prefetch(this.PREFETCH);

    await this.channel.assertExchange(this.exchange, 'direct', { durable: true });

    await this.channel.assertQueue(this.queue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': `${this.exchange}.dlx`,
      },
    });

    await this.channel.bindQueue(this.queue, this.exchange, this.routingKey);

    await this.channel.consume(this.queue, (msg) => this.consume(msg));
  }

  private async consume(msg: ConsumeMessage | null) {
    if (!msg) return;

    const retryCount = this.getRetryCount(msg);

    try {
      const content = JSON.parse(msg.content.toString());

      await this.handleMessage(content);

      this.channel.ack(msg);
    } catch (error) {
      this.logger.error('Processing error', error);

      if (retryCount < this.MAX_RETRIES) {
        this.logger.warn(`Retrying message (${retryCount + 1})`);
        this.channel.nack(msg, false, true);
        return;
      }

      this.logger.error('Max retries reached. Sending to DLQ');
      this.channel.nack(msg, false, false);
    }
  }

  private getRetryCount(msg: ConsumeMessage): number {
    const death = msg?.properties?.headers?.['x-death'];
    return death?.[0]?.count ?? 0;
  }

  protected abstract handleMessage(data: any): Promise<void>;
}
