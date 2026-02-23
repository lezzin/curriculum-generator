import { Injectable, Logger } from "@nestjs/common";
import { buildResumePrompt } from "../helpers/resume.helper";
import { ResumeOptionsDto } from "../dto/prompt.dto";
import { GeminiService } from "src/modules/gemini/services/gemini.service";
import { InjectRepository } from "@nestjs/typeorm";
import { ResumeEntity } from "../entities/resume.entity";
import { Repository } from "typeorm";
import { Resume } from "../interfaces/resume.interfaces";

@Injectable()
export class ResumeService {
    private readonly logger = new Logger(ResumeService.name);

    constructor(
        @InjectRepository(ResumeEntity)
        private readonly resumeRepository: Repository<ResumeEntity>,
        private readonly geminiService: GeminiService
    ) { }

    async generateAIResume(baseResume: any, jobDescription: string, options: ResumeOptionsDto) {
        const prompt = buildResumePrompt(baseResume, jobDescription, options)
        const resume = await this.geminiService.generateJsonResponse(prompt) as Resume

        await this.resumeRepository.save({ ...resume }).catch(err => {
            this.logger.error("Failed to save resume to database", err)
        })

        return resume
    }

    async getResumes(): Promise<ResumeEntity[]> {
        return this.resumeRepository.find();
    }
}