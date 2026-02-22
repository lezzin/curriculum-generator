import { Module } from '@nestjs/common';
import { FreelanceService } from './services/freelance.service';
import { FreelanceController } from './freelance.controller';

@Module({
    controllers: [FreelanceController],
    providers: [FreelanceService],
})
export class FreelanceModule { }
