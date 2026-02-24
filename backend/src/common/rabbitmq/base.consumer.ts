import { Logger, OnModuleInit } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';
import { RabbitMQConnection } from './rabbitmq.connection';

export abstract class BaseConsumer implements OnModuleInit {
    protected abstract exchange: string;
    protected abstract routingKey: string;
    protected abstract queue: string;

    protected readonly PREFETCH = 10;
    protected readonly MAX_RETRIES = 5;

    protected readonly logger = new Logger(this.constructor.name);

    constructor(protected readonly rmq: RabbitMQConnection) { }

    async onModuleInit() {
        const channel = await this.rmq.getChannel();

        if (!channel) {
            this.logger.error('Failed to establish RabbitMQ channel');
            return;
        }

        await channel.prefetch(this.PREFETCH);

        await channel.assertExchange(this.exchange, 'direct', { durable: true });

        await channel.assertQueue(this.queue, {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': `${this.exchange}.dlx`,
            },
        });

        await channel.bindQueue(this.queue, this.exchange, this.routingKey);

        await channel.consume(this.queue, (msg) => this.consume(msg));
    }

    private async consume(msg: ConsumeMessage | null) {
        if (!msg) return;

        const channel = await this.rmq.getChannel();

        if (!channel) {
            this.logger.error('Failed to establish RabbitMQ channel');
            return;
        }

        const retryCount = this.getRetryCount(msg);

        try {
            const content = JSON.parse(msg.content.toString());

            await this.handleMessage(content);

            channel.ack(msg);
        } catch (error) {
            this.logger.error('Processing error', error);

            if (retryCount < this.MAX_RETRIES) {
                this.logger.warn(`Retrying message (${retryCount + 1})`);
                channel.nack(msg, false, true);
                return;
            }

            this.logger.error('Max retries reached. Sending to DLQ');
            channel.nack(msg, false, false);
        }
    }

    private getRetryCount(msg: ConsumeMessage): number {
        const death = msg?.properties?.headers?.['x-death'];
        return death?.[0]?.count ?? 0;
    }

    protected abstract handleMessage(data: any): Promise<void>;
}