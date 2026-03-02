import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FreelanceProposalRepository } from 'src/domain/repositories/freelance-proposal.repository';
import { FreelanceProposalEntity } from '../entities/freelance-proposal.entity';
import { FreelanceProposal } from 'src/domain/entities/freelance-proposal.entity';
import { BaseDataType } from 'src/domain/shared/enums/base-data-type.enum';

@Injectable()
export class TypeOrmFreelanceProposalRepository implements FreelanceProposalRepository {
  constructor(
    @InjectRepository(FreelanceProposalEntity)
    private ormRepo: Repository<FreelanceProposalEntity>,
  ) {}

  async create(
    freelanceProposal: FreelanceProposal,
  ): Promise<FreelanceProposal> {
    return await this.ormRepo.save(freelanceProposal);
  }

  async getAll(userId: string): Promise<FreelanceProposal[]> {
    return (await this.ormRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    })) as FreelanceProposal[];
  }
}
