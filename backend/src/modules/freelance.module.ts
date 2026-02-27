import { Module } from '@nestjs/common';
import { FreelanceController } from 'src/presentation/controllers/freelance/freelance.controller';
import { GenerateProposalUseCase } from 'src/application/use-cases/freelance/generate-proposal.use-case';
import { FreelanceProposalRepository } from 'src/domain/repositories/freelance-proposal.repository';
import { BullMQProposalQueue } from 'src/infrastructure/queue/bullmq-proposal.queue';
import { GeminiService } from 'src/infrastructure/services/gemini.service';
import { TypeOrmFreelanceProposalRepository } from 'src/infrastructure/database/repositories/freelance-proposal.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreelanceProposalEntity } from 'src/infrastructure/database/entities/freelance-proposal.entity';
import { DiscordService } from 'src/infrastructure/services/discord.service';
import { GetAllProposalsUseCase } from 'src/application/use-cases/freelance/get-all-proposals.use-case';
import { BaseDataModule } from './base-data.module';
import { BullMQModule } from 'src/infrastructure/queue/bullmq.module';
import { FreelanceProcessor } from 'src/infrastructure/queue/processors/freelance.processor';
import { BullModule } from '@nestjs/bullmq';
import { SseService } from 'src/infrastructure/services/sse.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([FreelanceProposalEntity]),
        BaseDataModule,
        BullMQModule,
        BullModule.registerQueue({
            name: 'freelance.queue'
        })
    ],
    controllers: [FreelanceController],
    providers: [
        {
            provide: FreelanceProposalRepository,
            useClass: TypeOrmFreelanceProposalRepository,
        },
        GeminiService,
        DiscordService,
        SseService,
        BullMQProposalQueue,
        FreelanceProcessor,
        {
            provide: GenerateProposalUseCase,
            useFactory: (proposalQueue: BullMQProposalQueue) =>
                new GenerateProposalUseCase(proposalQueue),
            inject: [BullMQProposalQueue],
        },
        {
            provide: GetAllProposalsUseCase,
            useFactory: (freelanceProposalRepository: FreelanceProposalRepository) =>
                new GetAllProposalsUseCase(freelanceProposalRepository),
            inject: [FreelanceProposalRepository],
        },

    ],
    exports: [GenerateProposalUseCase],
})
export class FreelanceModule { }