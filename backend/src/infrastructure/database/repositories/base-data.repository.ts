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

    async upsert(baseData: BaseData): Promise<void> {
        await this.ormRepo.upsert({
            userId: baseData.userId,
            description: baseData.description,
            type: baseData.type
        }, ["userId", "type"]);
    }

    async remove(userId: string, type: BaseDataType): Promise<void> {
        await this.ormRepo.delete({ userId, type })
    }

    async getAll(userId: string): Promise<BaseData[]> {
        return await this.ormRepo.findBy({ userId }) as BaseData[];
    }

    async findDescriptionByUserAndType(userId: string, type: BaseDataType): Promise<string | null> {
        const entity = await this.ormRepo.findOne({
            where: { userId, type },
            select: ['description']
        })

        if (!entity) {
            return null
        }

        return entity.description;
    }
}