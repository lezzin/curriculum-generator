import { Injectable } from '@nestjs/common';
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { DiscordWebhookService } from 'src/modules/discord/discord-webhook.service';
import { GeminiPrompt } from '../types/gemini.types';

@Injectable()
export class GeminiService {
  private model: GenerativeModel;

  constructor(
    private readonly configService: ConfigService,
    private readonly discordWebhookService: DiscordWebhookService,
  ) {
    const generativeAI = new GoogleGenerativeAI(
      this.configService.getOrThrow('GEMINI_API_KEY'),
    );

    this.model = generativeAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });
  }

  async generateContent(data: GeminiPrompt) {
    const { discordData, prompt } = data;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;

    const { usageMetadata } = response;

    const promptTokens = usageMetadata?.promptTokenCount ?? 0;
    const completionTokens = usageMetadata?.candidatesTokenCount ?? 0;
    const totalTokens = usageMetadata?.totalTokenCount ?? 0;

    const costPerMillion = 1; // USD
    const estimatedCost = (totalTokens / 1_000_000) * costPerMillion;

    await this.discordWebhookService.sendMessage('Uso da IA', [
      ...discordData ?? '',
      `**Prompt Tokens:** ${promptTokens.toString()}`,
      `**Completion Tokens:** ${completionTokens.toString()}`,
      `**Total Tokens:** ${totalTokens.toString()}`,
      `**Custo estimado (USD):** $${estimatedCost.toFixed(6)}`,
    ]);

    return response.text();
  }

  async generateJsonResponse<T>(data: GeminiPrompt): Promise<T> {
    return this.generateContent(data).then((text) => {
      const cleaned = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      return JSON.parse(cleaned) as T;
    });
  }
}
