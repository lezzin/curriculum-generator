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

  async save(userConfig: UserConfig): Promise<void> {
    await this.ormRepo.upsert({ ...userConfig }, ['userId']);
  }

  async findByUserId(userId: string): Promise<UserConfig | null> {
    const entity = await this.ormRepo.findOne({ where: { userId } })
    return entity ? this.toDomain(entity) : null;
  }

  private toDomain(entity: UserConfigEntity): UserConfig {
    const userConfig = new UserConfig(
      entity.id,
      entity.createdAt,
      entity.updatedAt,
      entity.userId,
      entity.linkedin,
      entity.github,
      entity.portfolio,
      entity.cellphone
    );

    return userConfig;
  }
}
