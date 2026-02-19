import { Module } from '@nestjs/common';
import { GeminiController } from './modules/gemini/gemini.controller';
import { GeminiService } from './modules/gemini/gemini.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot()
  ],
  controllers: [GeminiController],
  providers: [GeminiService],
})
export class AppModule { }
