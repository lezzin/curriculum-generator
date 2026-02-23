import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Channel, ChannelModel, connect, ConsumeMessage } from 'amqplib';
import { ConfigService } from '@nestjs/config';
import { FreelanceService } from '../services/freelance.service';
import { SolicitationDto } from '../dto/freelance.dto';
import { baseFreelance } from 'src/data/base-freelance';

@Injectable()
export class RabbitMQConsumerService implements OnModuleInit {
    private readonly logger = new Logger(RabbitMQConsumerService.name);

    private readonly exchange = 'freelance-proposal-generator-exchange';
    private readonly routingKey = 'freelance-proposal-generator';
    private readonly queue = 'freelance-proposal-generator-queue';

    private readonly deadLetterExchange = 'x-dead-letter-exchange-freelance-proposal-generator';
    private readonly deadLetterRoutingKey = 'dead_letter_key';

    private readonly PREFETCH_COUNT = 10;

    private connection: ChannelModel;
    private channel: Channel;

    constructor(
        private readonly freelanceService: FreelanceService,
        private readonly configService: ConfigService,
    ) { }

    async onModuleInit() {
        await this.initialize();
    }

    private async initialize() {
        const user = this.configService.get<string>('RABBITMQ_USER');
        const password = this.configService.get<string>('RABBITMQ_PASSWORD');
        const url = this.configService.get<string>('RABBITMQ_URL');

        try {
            this.connection = await connect(`amqp://${user}:${password}@${url}`);
            this.channel = await this.connection.createChannel();

            await this.channel.prefetch(this.PREFETCH_COUNT);
            await this.channel.assertExchange(this.exchange, 'direct', {
                durable: true,
            });
            await this.channel.assertExchange(this.deadLetterExchange, 'direct', {
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

            await this.channel.consume(this.queue, (msg: ConsumeMessage | null): void => {
                if (!msg) return;

                const message = JSON.parse(msg.content.toString());

                this.processMessage(message, msg).catch((error) => {
                    this.logger.error('❌ Unhandled error while processing message', error.stack);
                });
            });

            this.logger.log(`✅ RabbitMQ consumer initialized successfully (exchange: ${this.exchange}, queue: ${this.queue}, routingKey: ${this.routingKey}).`);
        } catch (error: unknown) {
            const err = error instanceof Error ? error : new Error(String(error));
            this.logger.error('❌ Failed to initialize RabbitMQ consumer.', err.stack);
            throw err;
        }
    }

    private async processMessage(message: any, originalMsg: ConsumeMessage) {
        if (!this.channel) {
            this.logger.warn('⚠️ Channel not initialized. Reconnecting to RabbitMQ...');
            await this.initialize();
        }

        try {
            const { solicitation } = message as SolicitationDto;
            this.logger.debug(`Received message for processing: ${JSON.stringify(message)}`);

            await this.freelanceService.generateAIProposal(
                baseFreelance,
                solicitation,
            );
        } catch (error: unknown) {
            const err = error instanceof Error ? error : new Error(String(error));
            this.logger.error(`❌ Error while processing message`, err.stack);
        } finally {
            this.channel.ack(originalMsg);
        }
    }
}
