import { Body, Controller, Post } from "@nestjs/common";
import { GenerateDto } from "./dto/prompt.dto";
import { GeminiService } from "./gemini.service";
import { baseResume } from "src/data/base-resume";

@Controller('/gemini')
export class GeminiController {
    constructor(
        private readonly geminiService: GeminiService
    ) { }

    @Post('/generate-curriculum')
    async generateCurriculum(@Body() generateDto: GenerateDto) {
        const { jobDescription, options } = generateDto

        return await this.geminiService.generateAIResume(
            baseResume,
            jobDescription,
            options
        )
    }
}