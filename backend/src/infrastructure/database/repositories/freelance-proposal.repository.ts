import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FreelanceProposalRepository } from 'src/domain/repositories/freelance-proposal.repository';
import { FreelanceProposalEntity } from '../entities/freelance-proposal.entity';
import { FreelanceProposal } from 'src/domain/entities/freelance-proposal.entity';
import { PaginatedResult } from 'src/domain/interfaces/paginate.interfaces';

@Injectable()
export class TypeOrmFreelanceProposalRepository implements FreelanceProposalRepository {
  constructor(
    @InjectRepository(FreelanceProposalEntity)
    private ormRepo: Repository<FreelanceProposalEntity>,
  ) { }

  async create(
    freelanceProposal: FreelanceProposal,
  ): Promise<FreelanceProposal> {
    return await this.ormRepo.save(freelanceProposal);
  }

  async paginate(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResult<FreelanceProposal>> {
    const query = this.ormRepo
      .createQueryBuilder('proposal')
      .where('proposal.userId = :userId', { userId })
      .orderBy('proposal.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await query.getManyAndCount()

    return {
      data: data.map(this.toDomain),
      total,
      page,
      limit
    }
  }

  async remove(id: string): Promise<void> {
    await this.ormRepo.delete(id);
  }

  private toDomain(entity: FreelanceProposalEntity): FreelanceProposal {
    const user = new FreelanceProposal(
      entity.id,
      entity.prompt,
      entity.message,
      entity.bidAmount,
      entity.deliveryDays,
      entity.userId,
      entity.createdAt
    );

    return user;
  }
}
