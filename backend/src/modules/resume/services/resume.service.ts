import { Injectable } from "@nestjs/common";
import { buildResumePrompt } from "../helpers/resume.helper";
import { ResumeOptionsDto } from "../dto/prompt.dto";
import { GeminiService } from "src/modules/gemini/services/gemini.service";

@Injectable()
export class ResumeService {
    constructor(
        private readonly geminiService: GeminiService
    ) { }

    async generateAIResume(baseResume: any, jobDescription: string, options: ResumeOptionsDto) {
        const prompt = buildResumePrompt(baseResume, jobDescription, options)
        return await this.geminiService.generateJsonResponse(prompt)
    }
}