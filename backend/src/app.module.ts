import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiModule } from './modules/gemini/gemini.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GeminiModule,
  ],
})
export class AppModule { }
