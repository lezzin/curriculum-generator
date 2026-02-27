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
import { BullMQModule } from 'src/infrastructure/modules/bullmq.module';
import { FreelanceProcessor } from 'src/infrastructure/queue/processors/freelance.processor';
import { BullModule } from '@nestjs/bullmq';
import { SseModule } from 'src/infrastructure/modules/sse.module';
import { CacheRepository } from 'src/domain/repositories/cache.repository';
import { CacheModule } from 'src/infrastructure/modules/cache.module';
import { ProposalGenerationUseCase } from 'src/application/use-cases/freelance/proposal-generation.use-case';
import { BaseDataRepository } from 'src/domain/repositories/base-data.repository';
import { SseService } from 'src/infrastructure/services/sse.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([FreelanceProposalEntity]),
        BaseDataModule,
        BullMQModule,
        SseModule,
        CacheModule,
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
            useFactory: (freelanceProposalRepository: FreelanceProposalRepository, cache: CacheRepository) =>
                new GetAllProposalsUseCase(freelanceProposalRepository, cache),
            inject: [FreelanceProposalRepository, CacheRepository],
        },
        {
            provide: ProposalGenerationUseCase,
            useFactory: (
                freelanceProposalRepository: FreelanceProposalRepository,
                baseDataRepository: BaseDataRepository,
                geminiService: GeminiService,
                sseService: SseService,
                cache: CacheRepository,
            ) =>
                new ProposalGenerationUseCase(
                    freelanceProposalRepository,
                    baseDataRepository,
                    geminiService,
                    sseService,
                    cache,
                ),
            inject: [
                FreelanceProposalRepository,
                BaseDataRepository,
                GeminiService,
                SseService,
                CacheRepository,
            ],
        },

    ],
    exports: [GenerateProposalUseCase],
})
export class FreelanceModule { }