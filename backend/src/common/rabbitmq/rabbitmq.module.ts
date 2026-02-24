import { Module } from '@nestjs/common';
import { RabbitMQConnection } from './rabbitmq.connection';

@Module({
    providers: [
        RabbitMQConnection
    ],
    exports: [
        RabbitMQConnection,
    ],
})
export class RabbitMQModule { }