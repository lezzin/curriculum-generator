import { Injectable, Logger } from "@nestjs/common";
import { buildResumePrompt } from "../helpers/resume.helper";
import { ResumeOptionsDto } from "../dto/prompt.dto";
import { GeminiService } from "src/modules/gemini/services/gemini.service";
import { InjectRepository } from "@nestjs/typeorm";
import { ResumeEntity } from "../entities/resume.entity";
import { Repository } from "typeorm";
import { Resume } from "../interfaces/resume.interfaces";
import { SseService } from "src/modules/sse/sse.service";
import { CacheService } from "src/modules/cache/cache.service";
import { ResumePublisher } from "../messaging/rabbimq-publisher";

@Injectable()
export class ResumeService {
    private readonly logger = new Logger(ResumeService.name);

    private readonly CACHE_KEY = "resume:all";

    constructor(
        @InjectRepository(ResumeEntity)
        private readonly resumeRepository: Repository<ResumeEntity>,

        private readonly resumePublisher: ResumePublisher,
        private readonly geminiService: GeminiService,
        private readonly sseService: SseService,
        private readonly cacheService: CacheService,
    ) { }

    async sendResumeToQueue(baseResume: any, jobDescription: string, options: ResumeOptionsDto) {
        await this.resumePublisher.publish({ baseResume, jobDescription, options }).catch(err => {
            this.logger.error("Failed to publish message to RabbitMQ", err)
        })

        return { message: "Solicitação enviada com sucesso!" }
    }

    async generateAIResume(baseResume: any, jobDescription: string, options: ResumeOptionsDto) {
        const prompt = buildResumePrompt(baseResume, jobDescription, options)
        const resume = await this.geminiService.generateJsonResponse(prompt) as Resume

        const savedResume = await this.resumeRepository.save({ ...resume, prompt: jobDescription }).catch(err => {
            this.logger.error("Failed to save resume to database", err)
        })

        this.cacheService.del(this.CACHE_KEY).catch(err => {
            this.logger.error("Failed to invalidate resumes cache", err)
        })

        this.sseService.sendEvent({ event: "resume-generated", data: savedResume })
    }

    async getResumes(): Promise<ResumeEntity[] | undefined> {
        return await this.cacheService.getOrSet<ResumeEntity[]>(
            this.CACHE_KEY,
            async () => {
                const resumes = await this.resumeRepository.find({
                    order: { createdAt: "DESC" },
                });

                return resumes;
            },
            1800,
        ).catch(err => {
            this.logger.error("Failed to fetch resumes", err);
            return [];
        });
    }
}