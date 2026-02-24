import { Injectable } from '@nestjs/common';
import { BasePublisher } from 'src/common/rabbitmq/base.publisher';
import { RabbitMQConnection } from 'src/common/rabbitmq/rabbitmq.connection';

@Injectable()
export class FreelancePublisher extends BasePublisher {
    protected exchange = 'freelance.exchange';
    protected routingKey = 'freelance.generate';
    protected queue = 'freelance.queue';

    constructor(rmq: RabbitMQConnection) {
        super(rmq);
    }
}