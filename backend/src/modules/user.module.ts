import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../domain/repositories/user.repository';
import { UserEntity } from 'src/infrastructure/database/entities/user.entity';
import { TypeOrmUserRepository } from 'src/infrastructure/database/repositories/user.repository';
import { RegisterUserUseCase } from 'src/application/use-cases/user/register-user.use-case';
import { UserController } from 'src/presentation/controllers/user/user.controller';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [
        {
            provide: UserRepository,
            useClass: TypeOrmUserRepository,
        },
        {
            provide: RegisterUserUseCase,
            useFactory: (
                userRepository: UserRepository,
            ) => {
                return new RegisterUserUseCase(userRepository);
            },
            inject: [UserRepository],
        },
    ],
    exports: [UserRepository],
})
export class UserModule { }