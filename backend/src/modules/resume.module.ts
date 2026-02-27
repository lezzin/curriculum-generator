import { Module } from '@nestjs/common';
import { GeminiService } from 'src/infrastructure/services/gemini.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscordService } from 'src/infrastructure/services/discord.service';
import { BaseDataModule } from './base-data.module';
import { BullMQModule } from 'src/infrastructure/queue/bullmq.module';
import { BullModule } from '@nestjs/bullmq';
import { ResumeEntity } from 'src/infrastructure/database/entities/resume.entity';
import { ResumeController } from 'src/presentation/controllers/resume/resume.controller';
import { ResumeRepository } from 'src/domain/repositories/resume.repository';
import { TypeOrmResumeRepository } from 'src/infrastructure/database/repositories/resume.repository';
import { BullMQResumeQueue } from 'src/infrastructure/queue/bullmq-resume.queue';
import { GenerateResumeUseCase } from 'src/application/use-cases/resume/generate-resume.use-case';
import { GetAllResumesUseCase } from 'src/application/use-cases/resume/get-all-resumes.use-case';
import { ResumeProcessor } from 'src/infrastructure/queue/processors/resume.processor';
import { StorageModule } from 'src/infrastructure/storage/storage.module';
import { PdfService } from 'src/infrastructure/services/pdf.service';
import { SseService } from 'src/infrastructure/services/sse.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ResumeEntity]),
        BaseDataModule,
        BullMQModule,
        StorageModule,
        BullModule.registerQueue({
            name: 'resume.queue'
        })
    ],
    controllers: [ResumeController],
    providers: [
        {
            provide: ResumeRepository,
            useClass: TypeOrmResumeRepository,
        },
        GeminiService,
        PdfService,
        SseService,
        DiscordService,
        BullMQResumeQueue,
        ResumeProcessor,
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

    ],
})
export class ResumeModule { }