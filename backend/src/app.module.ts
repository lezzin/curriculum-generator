import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiModule } from './modules/gemini/gemini.module';
import { FreelanceModule } from './modules/freelance/freelance.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GeminiModule,
    FreelanceModule,
  ],
})
export class AppModule { }
