import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Channel, ChannelModel, connect } from 'amqplib';

@Injectable()
export class RabbitMQConnection implements OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQConnection.name);

  private connection: ChannelModel;
  private channel: Channel | null = null;

  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_DELAY = 30000;

  constructor(private readonly configService: ConfigService) {}

  async getChannel(): Promise<Channel> {
    if (this.channel) return this.channel;

    await this.connect();

    if (!this.channel) {
      throw new Error('Failed to establish RabbitMQ channel');
    }

    return this.channel;
  }

  private async connect() {
    const user = this.configService.get<string>('RABBITMQ_USER');
    const password = this.configService.get<string>('RABBITMQ_PASSWORD');
    const url = this.configService.get<string>('RABBITMQ_URL');

    try {
      this.connection = await connect(`amqp://${user}:${password}@${url}`);
      this.channel = await this.connection.createChannel();

      this.connection.on('error', (err) => {
        this.logger.error('RabbitMQ connection error', err);
      });

      this.connection.on('close', () => {
        this.logger.warn('RabbitMQ connection closed. Reconnecting...');
        this.channel = null;
        this.retryReconnect();
      });

      this.reconnectAttempts = 0;
      this.logger.log('✅ RabbitMQ connected');
    } catch (error) {
      this.logger.error('❌ Initial connection failed');
      await this.retryReconnect();
    }
  }

  private async retryReconnect() {
    this.reconnectAttempts++;

    const delay = Math.min(
      1000 * 2 ** this.reconnectAttempts,
      this.MAX_RECONNECT_DELAY,
    );

    this.logger.warn(`Reconnecting in ${delay}ms...`);

    setTimeout(() => this.connect(), delay);
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }
}
