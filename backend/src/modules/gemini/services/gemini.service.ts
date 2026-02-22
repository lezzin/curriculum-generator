import { Injectable } from "@nestjs/common";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GeminiService {
    private model: GenerativeModel

    constructor(
        private readonly configService: ConfigService
    ) {
        const generativeAI = new GoogleGenerativeAI(this.configService.getOrThrow('GEMINI_API_KEY'))

        this.model = generativeAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        })
    }

    async generateContent(prompt: string) {
        const result = await this.model.generateContent(prompt)
        const response = await result.response
        return response.text()
    }

    async generateJsonResponse<T>(prompt: string): Promise<T> {
        return this.generateContent(prompt).then(text => {
            const cleaned = text
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim()

            return JSON.parse(cleaned) as T
        })
    }
}