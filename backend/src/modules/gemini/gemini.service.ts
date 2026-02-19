import { Injectable } from "@nestjs/common";
import { buildResumePrompt } from "./helpers/resume.helper";
import { ResumeOptionsDto } from "./dto/prompt.dto";
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

    async generateAIResume(baseResume: any, jobDescription: string, options: ResumeOptionsDto) {
        const prompt = buildResumePrompt(baseResume, jobDescription, options)

        const result = await this.model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        const cleaned = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim()

        return JSON.parse(cleaned)
    }
}