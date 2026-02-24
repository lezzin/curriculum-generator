import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Channel, ChannelModel, connect, Connection } from 'amqplib';

@Injectable()
export class RabbitMQConnection implements OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQConnection.name);

  private connection: ChannelModel | null = null;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_DELAY = 30000;

  constructor(private readonly configService: ConfigService) { }

  async getConnection(): Promise<ChannelModel> {
    if (this.connection) return this.connection;

    await this.connect();

    if (!this.connection) {
      throw new Error('Failed to establish RabbitMQ connection');
    }

    return this.connection;
  }

  async createChannel(): Promise<Channel> {
    const conn = await this.getConnection();
    return conn.createChannel();
  }

  private async connect() {
    const user = this.configService.get<string>('RABBITMQ_USER');
    const password = this.configService.get<string>('RABBITMQ_PASSWORD');
    const url = this.configService.get<string>('RABBITMQ_URL');

    try {
      this.connection = await connect(`amqp://${user}:${password}@${url}`);
      this.connection.on('error', (err) => this.logger.error('RabbitMQ connection error', err));
      this.connection.on('close', () => {
        this.logger.warn('RabbitMQ connection closed. Reconnecting...');
        this.connection = null;
        this.retryReconnect();
      });
      this.reconnectAttempts = 0;
      this.logger.log('✅ RabbitMQ connected');
    } catch (err) {
      this.logger.error('❌ RabbitMQ initial connection failed', err);
      await this.retryReconnect();
    }
  }

  private async retryReconnect() {
    this.reconnectAttempts++;
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, this.MAX_RECONNECT_DELAY);
    this.logger.warn(`Reconnecting in ${delay}ms...`);
    setTimeout(() => this.connect(), delay);
  }

  async onModuleDestroy() {
    await this.connection?.close();
  }
}