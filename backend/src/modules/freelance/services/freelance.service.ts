import { Injectable, Logger } from '@nestjs/common';
import { build99FreelasProposalPrompt } from '../helpers/freelance.helper';
import { GeminiService } from 'src/modules/gemini/services/gemini.service';
import { SseService } from 'src/modules/sse/sse.service';
import { FreelanceProposalEntity } from '../entities/freelance-proposal.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MarketplaceProposal } from '../interfaces/freelance.interfaces';
import { FreelancePublisher } from '../messaging/rabbimq-publisher';
import { CacheService } from 'src/modules/cache/cache.service';
import { BaseService } from 'src/modules/profile/base.service';
import { BaseType } from 'src/modules/profile/enum/base-type.enum';

@Injectable()
export class FreelanceService {
  private readonly logger = new Logger(FreelanceService.name);

  private readonly CACHE_KEY_PREFIX = 'freelance:proposals:all';

  constructor(
    @InjectRepository(FreelanceProposalEntity)
    private readonly freelanceProposalRepository: Repository<FreelanceProposalEntity>,
    private readonly freelancePublisher: FreelancePublisher,
    private readonly geminiService: GeminiService,
    private readonly sseService: SseService,
    private readonly cacheService: CacheService,
    private readonly baseService: BaseService,
  ) { }

  async sendProposalToQueue(solicitation: string, userId: string) {
    await this.freelancePublisher
      .publish({ solicitation, userId })
      .catch((err) => {
        this.logger.error('Failed to publish message to RabbitMQ', err);
      });

    return { message: 'Solicitação enviada com sucesso!' };
  }

  async generateAIProposal(solicitation: string, userId: string) {
    const baseData = (await this.baseService.getType(BaseType.FREELANCE_PROPOSAL, userId)).data

    try {
      const prompt = build99FreelasProposalPrompt(baseData, solicitation);
      const proposal = await this.geminiService.generateJsonResponse<MarketplaceProposal>(prompt);

      const savedProposal = await this.freelanceProposalRepository.save({
        ...proposal,
        prompt: solicitation,
        userId: userId,
      });

      await this.cacheService.del(`${this.CACHE_KEY_PREFIX}:${userId}`);

      this.sseService.sendEvent({
        event: 'proposal-generated',
        data: savedProposal,
      });

      return savedProposal;
    } catch (err) {
      this.logger.error('Failed to generate AI proposal flow', err);
      throw err;
    }
  }

  async getAllProposals(userId: string) {
    return await this.cacheService
      .getOrSet<FreelanceProposalEntity[]>(
        `${this.CACHE_KEY_PREFIX}:${userId}`,
        async () => {
          const proposals = await this.freelanceProposalRepository.find({
            order: { createdAt: 'DESC' },
            where: { userId },
          });

          return proposals;
        },
        1800,
      )
      .catch((err) => {
        this.logger.error('Failed to fetch proposals', err);
        return [];
      });
  }
}
