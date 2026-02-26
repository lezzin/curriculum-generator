import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../domain/repositories/user.repository';
import { UserEntity } from 'src/infrastructure/database/entities/user.entity';
import { TypeOrmUserRepository } from 'src/infrastructure/database/repositories/user.repository';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [
        {
            provide: UserRepository,
            useClass: TypeOrmUserRepository,
        },
    ],
    exports: [UserRepository],
})
export class UserModule { }