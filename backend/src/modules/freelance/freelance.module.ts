import { Module } from '@nestjs/common';
import { FreelanceService } from './services/freelance.service';
import { FreelanceController } from './freelance.controller';
import { GeminiModule } from '../gemini/gemini.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreelanceProposalEntity } from './entities/freelance-proposal.entity';
import { SseModule } from '../sse/sse.module';
import { RabbitMQPublisherService } from './messaging/rabbimq-publisher';
import { RabbitMQConsumerService } from './messaging/rabbitmq-consumer';

@Module({
    imports: [
        GeminiModule,
        TypeOrmModule.forFeature([FreelanceProposalEntity]),
        SseModule,
    ],
    controllers: [FreelanceController],
    providers: [
        FreelanceService,
        RabbitMQPublisherService,
        RabbitMQConsumerService
    ],
})
export class FreelanceModule { }
