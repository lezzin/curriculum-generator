import { Module } from '@nestjs/common';
import { FreelanceController } from 'src/presentation/controllers/freelance/freelance.controller';
import { GenerateProposalUseCase } from 'src/application/use-cases/freelance/generate-proposal.use-case';
import { FreelanceProposalRepository } from 'src/domain/repositories/freelance-proposal.repository';
import { BullMQProposalQueue } from 'src/infrastructure/queue/bullmq-proposal.queue';
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
import { ProposalGenerationUseCase } from 'src/application/use-cases/freelance/proposal-generation.use-case';
import { BaseDataRepository } from 'src/domain/repositories/base-data.repository';
import { RemoveProposalUseCase } from 'src/application/use-cases/freelance/remove-proposal.use-case';
import { GeminiService } from 'src/infrastructure/services/gemini/gemini.service';
import { SseRepository } from 'src/domain/repositories/sse.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([FreelanceProposalEntity]),
    BaseDataModule,
    BullMQModule,
    SseModule,
    BullModule.registerQueue({
      name: 'freelance.queue',
    }),
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
      useFactory: (
        freelanceProposalRepository: FreelanceProposalRepository,
      ) => new GetAllProposalsUseCase(freelanceProposalRepository),
      inject: [FreelanceProposalRepository],
    },
    {
      provide: ProposalGenerationUseCase,
      useFactory: (
        freelanceProposalRepository: FreelanceProposalRepository,
        baseDataRepository: BaseDataRepository,
        geminiService: GeminiService,
        sseRepository: SseRepository,
        cache: CacheRepository,
      ) =>
        new ProposalGenerationUseCase(
          freelanceProposalRepository,
          baseDataRepository,
          geminiService,
          sseRepository,
          cache,
        ),
      inject: [
        FreelanceProposalRepository,
        BaseDataRepository,
        GeminiService,
        SseRepository,
        CacheRepository,
      ],
    },
    {
      provide: RemoveProposalUseCase,
      useFactory: (
        freelanceProposalRepository: FreelanceProposalRepository,
        cache: CacheRepository,
      ) =>
        new RemoveProposalUseCase(freelanceProposalRepository, cache),
      inject: [FreelanceProposalRepository, CacheRepository],
    },
  ],
  exports: [GenerateProposalUseCase],
})
export class FreelanceModule { }
