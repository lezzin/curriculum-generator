import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { User } from 'src/domain/entities/user.entity';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private ormRepo: Repository<UserEntity>,
    ) { }

    async create(user: User): Promise<void> {
        await this.ormRepo.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        const entity = await this.ormRepo.findOne({ where: { email } });
        if (!entity) return null;

        return new User(
            entity.id,
            entity.name,
            entity.email,
            entity.password,
        );
    }

    async findById(id: string): Promise<User | null> {
        const entity = await this.ormRepo.findOne({ where: { id } });
        if (!entity) return null;

        return new User(
            entity.id,
            entity.name,
            entity.email,
            entity.password,
        );
    }
}