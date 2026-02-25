import { Module } from '@nestjs/common';
import { FreelanceService } from './services/freelance.service';
import { FreelanceController } from './freelance.controller';
import { GeminiModule } from '../gemini/gemini.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreelanceProposalEntity } from './entities/freelance-proposal.entity';
import { SseModule } from '../sse/sse.module';
import { FreelancePublisher } from './messaging/rabbimq-publisher';
import { FreelanceConsumer } from './messaging/rabbitmq-consumer';
import { CacheModule } from '../cache/cache.module';
import { AuthModule } from '../auth/auth.module';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [
    GeminiModule,
    TypeOrmModule.forFeature([FreelanceProposalEntity]),
    SseModule,
    CacheModule,
    AuthModule,
    ProfileModule,
  ],
  controllers: [FreelanceController],
  providers: [FreelanceService, FreelancePublisher, FreelanceConsumer],
})
export class FreelanceModule { }
