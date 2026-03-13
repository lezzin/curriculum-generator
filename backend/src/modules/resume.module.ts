import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscordService } from 'src/infrastructure/services/discord.service';
import { BaseDataModule } from './base-data.module';
import { BullMQModule } from 'src/infrastructure/modules/bullmq.module';
import { BullModule } from '@nestjs/bullmq';
import { ResumeEntity } from 'src/infrastructure/database/entities/resume.entity';
import { ResumeController } from 'src/presentation/controllers/resume/resume.controller';
import { ResumeRepository } from 'src/domain/repositories/resume.repository';
import { TypeOrmResumeRepository } from 'src/infrastructure/database/repositories/resume.repository';
import { BullMQResumeQueue } from 'src/infrastructure/queue/bullmq-resume.queue';
import { GenerateResumeUseCase } from 'src/application/use-cases/resume/generate-resume.use-case';
import { GetAllResumesUseCase } from 'src/application/use-cases/resume/get-all-resumes.use-case';
import { ResumeProcessor } from 'src/infrastructure/queue/processors/resume.processor';
import { ResumeDocumentService } from 'src/infrastructure/services/resume-document.service';
import { SseModule } from 'src/infrastructure/modules/sse.module';
import { GetPdfUseCase } from 'src/application/use-cases/resume/get-pdf.use-case';
import { CacheRepository } from 'src/domain/repositories/cache.repository';
import { BaseDataRepository } from 'src/domain/repositories/base-data.repository';
import { ResumeGenerationUseCase } from 'src/application/use-cases/resume/resume-generation.use-case';
import { UserConfigRepository } from 'src/domain/repositories/user-config.repository';
import { UserConfigModule } from './user-config.module';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { UserModule } from './user.module';
import { GetPageUseCase } from 'src/application/use-cases/resume/get-page.use-case';
import { RemoveResumeUseCase } from 'src/application/use-cases/resume/remove-resume.use-case';
import { GeminiService } from 'src/infrastructure/services/gemini/gemini.service';
import { SseRepository } from 'src/domain/repositories/sse.repository';
import { ResumeDocumentRepository } from 'src/domain/repositories/resume-document.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResumeEntity]),
    BaseDataModule,
    BullMQModule,
    SseModule,
    UserModule,
    UserConfigModule,
    BullModule.registerQueue({
      name: 'resume.queue',
    }),
  ],
  controllers: [ResumeController],
  providers: [
    {
      provide: ResumeRepository,
      useClass: TypeOrmResumeRepository,
    },
    GeminiService,
    {
      provide: ResumeDocumentRepository,
      useClass: ResumeDocumentService,
    },
    DiscordService,
    BullMQResumeQueue,
    ResumeProcessor,
    {
      provide: GetPdfUseCase,
      useFactory: (
        resumeDocumentRepository: ResumeDocumentRepository,
        resumeRepository: ResumeRepository,
        userRepository: UserRepository,
        userConfigRepository: UserConfigRepository,
      ) =>
        new GetPdfUseCase(
          resumeDocumentRepository,
          resumeRepository,
          userRepository,
          userConfigRepository,
        ),
      inject: [
        ResumeDocumentRepository,
        ResumeRepository,
        UserRepository,
        UserConfigRepository,
      ],
    },
    {
      provide: GenerateResumeUseCase,
      useFactory: (resumeQueue: BullMQResumeQueue) =>
        new GenerateResumeUseCase(resumeQueue),
      inject: [BullMQResumeQueue],
    },
    {
      provide: GetAllResumesUseCase,
      useFactory: (resumeRepository: ResumeRepository) =>
        new GetAllResumesUseCase(resumeRepository),
      inject: [ResumeRepository],
    },
    {
      provide: ResumeGenerationUseCase,
      useFactory: (
        resumeRepository: ResumeRepository,
        baseDataRepository: BaseDataRepository,
        userRepository: UserRepository,
        geminiService: GeminiService,
        sseRepository: SseRepository,
        cache: CacheRepository,
      ) =>
        new ResumeGenerationUseCase(
          resumeRepository,
          baseDataRepository,
          userRepository,
          geminiService,
          sseRepository,
          cache,
        ),
      inject: [
        ResumeRepository,
        BaseDataRepository,
        UserRepository,
        GeminiService,
        SseRepository,
        CacheRepository,
      ],
    },
    {
      provide: GetPageUseCase,
      useFactory: (
        resumeDocumentRepository: ResumeDocumentRepository,
        resumeRepository: ResumeRepository,
        userConfigRepository: UserConfigRepository,
        userRepository: UserRepository,
      ) =>
        new GetPageUseCase(
          resumeDocumentRepository,
          resumeRepository,
          userConfigRepository,
          userRepository,
        ),
      inject: [
        ResumeDocumentRepository,
        ResumeRepository,
        UserConfigRepository,
        UserRepository,
      ],
    },
    {
      provide: RemoveResumeUseCase,
      useFactory: (
        resumeRepository: ResumeRepository,
        cache: CacheRepository,
      ) => new RemoveResumeUseCase(resumeRepository, cache),
      inject: [ResumeRepository, CacheRepository],
    },
  ],
})
export class ResumeModule { }
