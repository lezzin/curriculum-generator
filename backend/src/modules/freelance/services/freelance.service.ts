import { Injectable } from "@nestjs/common";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { ConfigService } from "@nestjs/config";
import { build99FreelasProposalPrompt } from "../helpers/freelance.helper";

@Injectable()
export class FreelanceService {
    private model: GenerativeModel

    constructor(
        private readonly configService: ConfigService
    ) {
        const generativeAI = new GoogleGenerativeAI(this.configService.getOrThrow('GEMINI_API_KEY'))

        this.model = generativeAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        })
    }

    async generateAIProposal(baseData: any, solicitation: string) {
        const prompt = build99FreelasProposalPrompt(baseData, solicitation)

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