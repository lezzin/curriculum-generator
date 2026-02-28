import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserConfigRepository } from 'src/domain/repositories/user-config.repository';
import { UserConfig } from 'src/domain/entities/user.config.entity';
import { UserConfigEntity } from '../entities/user-config.entity';

@Injectable()
export class TypeOrmUserConfigRepository implements UserConfigRepository {
    constructor(
        @InjectRepository(UserConfigEntity)
        private ormRepo: Repository<UserConfigEntity>,
    ) { }

    async upsert(userConfig: UserConfig): Promise<void> {
        await this.ormRepo.upsert({ ...userConfig }, ["userId"]);
    }

    async findByUserId(userId: string): Promise<UserConfig | null> {
        return await this.ormRepo.findOne({ where: { userId } })
    }
}