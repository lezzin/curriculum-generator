import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { UserProviderEntity } from '../entities/user-provider.entity';
import { User } from 'src/domain/entities/user.entity';
import { UserProvider } from 'src/domain/entities/user-provider.entity';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private ormRepo: Repository<UserEntity>,
  ) { }

  async create(user: User): Promise<User> {
    const entity = this.toOrmEntity(user);
    const saved = await this.ormRepo.save(entity);
    return this.toDomain(saved);
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.ormRepo.findOne({
      where: { email },
      relations: ['providers'],
    });

    if (!entity) return null;
    return this.toDomain(entity);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.ormRepo.findOne({
      where: { id },
      relations: ['providers'],
    });

    if (!entity) return null;
    return this.toDomain(entity);
  }

  async findByProvider(
    provider: string,
    providerId: string,
  ): Promise<User | null> {
    const entity = await this.ormRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.providers', 'provider')
      .where('provider.provider = :provider', { provider })
      .andWhere('provider.providerId = :providerId', { providerId })
      .getOne();

    if (!entity) return null;
    return this.toDomain(entity);
  }

  async update(user: User): Promise<void> {
    await this.ormRepo.save(this.toOrmEntity(user));
  }

  private toDomain(entity: UserEntity): User {
    const user = new User(
      entity.id,
      entity.name,
      entity.email,
      entity.picture,
      entity.password,
      entity.refreshToken,
      entity.role
    );

    if (entity.providers) {
      entity.providers.forEach((p) => {
        user.addProvider(
          new UserProvider(p.id, p.userId, p.provider, p.providerId),
        );
      });
    }

    return user;
  }

  private toOrmEntity(user: User): UserEntity {
    const entity = new UserEntity();

    entity.id = user.id;
    entity.name = user.name;
    entity.email = user.email;
    entity.password = user.password;
    entity.picture = user.picture;
    entity.refreshToken = user.refreshToken;
    entity.role = user.role;

    entity.providers = user.getProviders().map((p) => {
      const provider = new UserProviderEntity();
      provider.id = p.id;
      provider.provider = p.provider;
      provider.providerId = p.providerId;
      provider.userId = p.userId;
      return provider;
    });

    return entity;
  }
}
