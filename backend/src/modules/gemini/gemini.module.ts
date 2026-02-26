import { Module } from '@nestjs/common';
import { GeminiService } from './services/gemini.service';
import { DiscordModule } from '../discord/discord.module';

@Module({
  imports: [DiscordModule],
  providers: [GeminiService],
  exports: [GeminiService],
})
export class GeminiModule { }
