import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { FreelanceProposalEntity } from '../entities/freelance-proposal.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from 'src/modules/cache/cache.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { BaseType } from 'src/modules/profile/enum/base-type.enum';
import { BaseService } from 'src/modules/profile/base.service';

@Injectable()
export class FreelanceService {
  private readonly logger = new Logger(FreelanceService.name);

  private readonly CACHE_KEY_PREFIX = 'freelance:proposals:all';

  constructor(
    @InjectQueue('freelance.queue')
    private readonly freelanceQueue: Queue,

    @InjectRepository(FreelanceProposalEntity)
    private readonly freelanceProposalRepository: Repository<FreelanceProposalEntity>,
    private readonly cacheService: CacheService,
    private readonly baseService: BaseService,
  ) { }

  async sendProposalToQueue(solicitation: string, userId: string) {
    const baseData = (await this.baseService.getType(BaseType.FREELANCE_PROPOSAL, userId)).data

    if (!baseData) {
      this.logger.debug(
        `Usuário ${userId} tentou gerar proposta freelance sem configurar dados base.`
      )

      throw new UnprocessableEntityException(
        'Você precisa cadastrar suas informações base de propostas freelance antes de gerar uma nova proposta.'
      )
    }

    await this.freelanceQueue.add('proposal', { solicitation, userId }, {
      attempts: 3,
      backoff: 5000,
    })

    return { message: 'Solicitação enviada com sucesso!' };
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
