import { Injectable } from "@nestjs/common";
import { build99FreelasProposalPrompt } from "../helpers/freelance.helper";
import { GeminiService } from "src/modules/gemini/services/gemini.service";

@Injectable()
export class FreelanceService {
    constructor(
        private readonly geminiService: GeminiService
    ) { }

    async generateAIProposal(baseData: any, solicitation: string) {
        const prompt = build99FreelasProposalPrompt(baseData, solicitation)
        return this.geminiService.generateJsonResponse(prompt)
    }
}