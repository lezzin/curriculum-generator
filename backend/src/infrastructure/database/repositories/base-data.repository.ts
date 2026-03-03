import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDataRepository } from 'src/domain/repositories/base-data.repository';
import { BaseDataEntity } from '../entities/base-data.entity';
import { BaseData } from 'src/domain/entities/base-data.entity';
import { BaseDataType } from 'src/domain/shared/enums/base-data-type.enum';

@Injectable()
export class TypeOrmBaseDataRepository implements BaseDataRepository {
  constructor(
    @InjectRepository(BaseDataEntity)
    private ormRepo: Repository<BaseDataEntity>,
  ) { }

  async save(baseData: BaseData): Promise<void> {
    await this.ormRepo.upsert(
      {
        userId: baseData.userId,
        description: baseData.description,
        type: baseData.type,
      },
      ['userId', 'type'],
    );
  }

  async remove(userId: string, type: BaseDataType): Promise<void> {
    await this.ormRepo.delete({ userId, type });
  }

  async getAll(userId: string): Promise<BaseData[]> {
    const entities = await this.ormRepo.findBy({ userId });
    return entities.map(entity => this.toDomain(entity))
  }

  async findByUserAndType(
    userId: string,
    type: BaseDataType,
  ): Promise<BaseData | null> {
    const entity = await this.ormRepo.findOneBy({ userId, type });
    return entity ? this.toDomain(entity) : null
  }

  private toDomain(entity: BaseDataEntity): BaseData {
    const baseData = new BaseData(
      entity.id,
      entity.description,
      entity.userId,
      entity.type,
      entity.createdAt,
    );

    return baseData;
  }
}
