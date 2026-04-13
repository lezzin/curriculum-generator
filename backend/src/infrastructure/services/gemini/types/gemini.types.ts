import { Schema } from "@google/generative-ai";

export type GeminiPrompt = {
  prompt: string;
  schema: Schema,
  discordData: string[] | null;
};
