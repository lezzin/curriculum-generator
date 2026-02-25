import { Module } from '@nestjs/common';
import { FreelanceService } from './services/freelance.service';
import { FreelanceController } from './freelance.controller';
import { GeminiModule } from '../gemini/gemini.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreelanceProposalEntity } from './entities/freelance-proposal.entity';
import { SseModule } from '../sse/sse.module';
import { CacheModule } from '../cache/cache.module';
import { AuthModule } from '../auth/auth.module';
import { ProfileModule } from '../profile/profile.module';
import { BullModule } from '@nestjs/bullmq';
import { FreelanceProcessor } from './services/freelance.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'freelance.queue',
    }),
    GeminiModule,
    TypeOrmModule.forFeature([FreelanceProposalEntity]),
    SseModule,
    CacheModule,
    AuthModule,
    ProfileModule,
  ],
  controllers: [FreelanceController],
  providers: [FreelanceService, FreelanceProcessor],
})
export class FreelanceModule { }
