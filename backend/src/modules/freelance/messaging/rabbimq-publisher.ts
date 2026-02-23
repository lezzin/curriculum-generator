import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Channel, ChannelModel, connect } from 'amqplib';

@Injectable()
export class RabbitMQPublisherService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RabbitMQPublisherService.name);

    private readonly exchange = 'freelance-proposal-generator-exchange';
    private readonly routingKey = 'freelance-proposal-generator';
    private readonly queue = 'freelance-proposal-generator-queue';

    private readonly deadLetterExchange = 'x-dead-letter-exchange-freelance-proposal-generator';
    private readonly deadLetterQueue = 'freelance-proposal-generator-dead-letter-queue';
    private readonly deadLetterRoutingKey = 'dead_letter_key';

    private connection: ChannelModel;
    private channel: Channel;

    constructor(private readonly configService: ConfigService) { }

    async onModuleInit() {
        await this.initialize();
    }

    async onModuleDestroy() {
        if (this.channel) await this.channel.close();
        if (this.connection) await this.connection.close();
    }

    private async initialize() {
        const user = this.configService.get<string>('RABBITMQ_USER');
        const password = this.configService.get<string>('RABBITMQ_PASSWORD');
        const url = this.configService.get<string>('RABBITMQ_URL');

        try {
            this.connection = await connect(`amqp://${user}:${password}@${url}`);
            this.channel = await this.connection.createChannel();

            await this.channel.assertExchange(this.deadLetterExchange, 'direct', {
                durable: true,
            });
            await this.channel.assertQueue(this.deadLetterQueue, { durable: true });
            await this.channel.bindQueue(this.deadLetterQueue, this.deadLetterExchange, this.deadLetterRoutingKey);

            await this.channel.assertExchange(this.exchange, 'direct', {
                durable: true,
            });

            await this.channel.assertQueue(this.queue, {
                durable: true,
                arguments: {
                    'x-dead-letter-exchange': this.deadLetterExchange,
                    'x-dead-letter-routing-key': this.deadLetterRoutingKey,
                },
            });

            await this.channel.bindQueue(this.queue, this.exchange, this.routingKey);

            this.logger.log(`✅ RabbitMQ publisher initialized successfully (exchange: ${this.exchange}, queue: ${this.queue}, routingKey: ${this.routingKey}).`);
        } catch (error: unknown) {
            const err = error instanceof Error ? error : new Error(String(error));

            this.logger.error('❌ Failed to initialize RabbitMQ publisher.', err);

            throw error;
        }
    }

    async publish(message: any, retries = 0) {
        if (!this.channel) {
            this.logger.warn('⚠️ Channel not initialized. Reconnecting to RabbitMQ...');
            await this.initialize();
        }

        const payload = Buffer.from(JSON.stringify(message));

        this.channel.publish(this.exchange, this.routingKey, payload, {
            headers: { 'x-retries': retries },
            persistent: true,
        });

        this.logger.log(`📤 Message published to exchange '${this.exchange}' with x-retries: ${retries}`);
    }
}
