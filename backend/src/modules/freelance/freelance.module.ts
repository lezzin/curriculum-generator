import { Module } from '@nestjs/common';
import { FreelanceService } from './services/freelance.service';
import { FreelanceController } from './freelance.controller';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
    imports: [GeminiModule],
    controllers: [FreelanceController],
    providers: [FreelanceService],
})
export class FreelanceModule { }
