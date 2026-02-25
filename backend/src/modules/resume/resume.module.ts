import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './services/resume.service';
import { PdfService } from './services/pdf.service';
import { GeminiModule } from '../gemini/gemini.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeEntity } from './entities/resume.entity';
import { SseModule } from '../sse/sse.module';
import { CacheModule } from '../cache/cache.module';
import { AuthModule } from '../auth/auth.module';
import { MinioModule } from '../minio/minio.module';
import { ProfileModule } from '../profile/profile.module';
import { ResumeProcessor } from './services/resume.processor';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'resume.queue',
    }),
    TypeOrmModule.forFeature([ResumeEntity]),
    GeminiModule,
    SseModule,
    CacheModule,
    AuthModule,
    MinioModule,
    ProfileModule,
  ],
  controllers: [ResumeController],
  providers: [ResumeService, PdfService, ResumeProcessor],
})
export class ResumeModule { }
