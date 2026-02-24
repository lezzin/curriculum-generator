import { Injectable, Logger } from "@nestjs/common";
import { build99FreelasProposalPrompt } from "../helpers/freelance.helper";
import { GeminiService } from "src/modules/gemini/services/gemini.service";
import { SseService } from "src/modules/sse/sse.service";
import { FreelanceProposalEntity } from "../entities/freelance-proposal.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { MarketplaceProposal } from "../interfaces/freelance.interfaces";
import { FreelancePublisher } from "../messaging/rabbimq-publisher";
import { CacheService } from "src/modules/cache/cache.service";

@Injectable()
export class FreelanceService {
    private readonly logger = new Logger(FreelanceService.name);

    private readonly CACHE_KEY = "freelance:proposals:all";

    constructor(
        @InjectRepository(FreelanceProposalEntity)
        private readonly freelanceProposalRepository: Repository<FreelanceProposalEntity>,
        private readonly freelancePublisher: FreelancePublisher,
        private readonly geminiService: GeminiService,
        private readonly sseService: SseService,
        private readonly cacheService: CacheService,
    ) { }

    async sendProposalToQueue(baseData: any, solicitation: string) {
        await this.freelancePublisher.publish({ baseData, solicitation }).catch(err => {
            this.logger.error("Failed to publish message to RabbitMQ", err)
        })

        return { message: "Solicitação enviada com sucesso!" }
    }

    async generateAIProposal(baseData: any, solicitation: string) {
        const prompt = build99FreelasProposalPrompt(baseData, solicitation)
        const proposal = await this.geminiService.generateJsonResponse(prompt) as MarketplaceProposal

        const savedProposal = await this.freelanceProposalRepository.save({ ...proposal }).catch(err => {
            this.logger.error("Failed to save proposal to database", err)
        })

        this.cacheService.del(this.CACHE_KEY).catch(err => {
            this.logger.error("Failed to invalidate proposals cache", err)
        })

        this.sseService.sendEvent({ event: "proposal-generated", data: savedProposal })
    }

    async getAllProposals() {
        return await this.cacheService.getOrSet<FreelanceProposalEntity[]>(
            this.CACHE_KEY,
            async () => {
                const proposals = await this.freelanceProposalRepository.find({
                    order: { createdAt: "DESC" },
                });

                return proposals;
            },
            1800,
        ).catch(err => {
            this.logger.error("Failed to fetch proposals", err);
            return [];
        });
    }
}