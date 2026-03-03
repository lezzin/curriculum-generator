import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../domain/repositories/user.repository';
import { UserEntity } from 'src/infrastructure/database/entities/user.entity';
import { TypeOrmUserRepository } from 'src/infrastructure/database/repositories/user.repository';
import { RegisterUserUseCase } from 'src/application/use-cases/user/register-user.use-case';
import { GetUserUseCase } from 'src/application/use-cases/user/get-user.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    {
      provide: UserRepository,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: RegisterUserUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new RegisterUserUseCase(userRepository);
      },
      inject: [UserRepository],
    },
    {
      provide: GetUserUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new GetUserUseCase(userRepository);
      },
      inject: [UserRepository],
    },
  ],
  exports: [UserRepository, GetUserUseCase, RegisterUserUseCase],
})
export class UserModule { }
