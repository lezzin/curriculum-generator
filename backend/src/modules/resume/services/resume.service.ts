import { Injectable, Logger } from "@nestjs/common";
import { buildResumePrompt } from "../helpers/resume.helper";
import { ResumeOptionsDto } from "../dto/prompt.dto";
import { GeminiService } from "src/modules/gemini/services/gemini.service";
import { InjectRepository } from "@nestjs/typeorm";
import { ResumeEntity } from "../entities/resume.entity";
import { Repository } from "typeorm";
import { Resume } from "../interfaces/resume.interfaces";
import { RabbitMQPublisherService } from "../messaging/rabbimq-publisher";

@Injectable()
export class ResumeService {
    private readonly logger = new Logger(ResumeService.name);

    constructor(
        @InjectRepository(ResumeEntity)
        private readonly resumeRepository: Repository<ResumeEntity>,
        private readonly rabbitMQPublisherService: RabbitMQPublisherService,
        private readonly geminiService: GeminiService
    ) { }

    async sendResumeToQueue(baseResume: any, jobDescription: string, options: ResumeOptionsDto) {
        await this.rabbitMQPublisherService.publish({ baseResume, jobDescription, options }).catch(err => {
            this.logger.error("Failed to publish message to RabbitMQ", err)
        })

        return { message: "Resume generation request sent to queue" }
    }

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