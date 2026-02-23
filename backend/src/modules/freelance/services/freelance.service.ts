import { Injectable, Logger } from "@nestjs/common";
import { build99FreelasProposalPrompt } from "../helpers/freelance.helper";
import { GeminiService } from "src/modules/gemini/services/gemini.service";
import { SseService } from "src/modules/sse/sse.service";
import { FreelanceProposalEntity } from "../entities/freelance-proposal.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { MarketplaceProposal } from "../interfaces/freelance.interfaces";
import { RabbitMQPublisherService } from "../messaging/rabbimq-publisher";

@Injectable()
export class FreelanceService {
    private readonly logger = new Logger(FreelanceService.name);

    constructor(
        @InjectRepository(FreelanceProposalEntity)
        private readonly resumeRepository: Repository<FreelanceProposalEntity>,
        private readonly rabbitMQPublisherService: RabbitMQPublisherService,
        private readonly geminiService: GeminiService,
        private readonly sseService: SseService,
    ) { }

    async sendProposalToQueue(baseData: any, solicitation: string) {
        await this.rabbitMQPublisherService.publish({ baseData, solicitation }).catch(err => {
            this.logger.error("Failed to publish message to RabbitMQ", err)
        })

        return { message: "Solicitação enviada com sucesso!" }
    }

    async generateAIProposal(baseData: any, solicitation: string) {
        const prompt = build99FreelasProposalPrompt(baseData, solicitation)
        const proposal = await this.geminiService.generateJsonResponse(prompt) as MarketplaceProposal

        const savedProposal = await this.resumeRepository.save({ ...proposal }).catch(err => {
            this.logger.error("Failed to save proposal to database", err)
        })

        this.sseService.sendEvent({ event: "proposal-generated", data: savedProposal })
    }

    async getAllProposals() {
        return await this.resumeRepository.find({
            order: { createdAt: "DESC" }
        })
    }
}