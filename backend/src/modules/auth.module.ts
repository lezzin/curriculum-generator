import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from '../infrastructure/auth/strategies/jwt.strategy';

import { UserModule } from './user.module';
import { UserRepository } from '../domain/repositories/user.repository';
import { AuthController } from 'src/presentation/controllers/auth/auth.controller';
import { LoginUseCase } from 'src/application/use-cases/auth/login.use-case';
import { JwtAdapter } from 'src/infrastructure/auth/jwt.service';
import { ConfigService } from '@nestjs/config';
import { SocialLoginUseCase } from 'src/application/use-cases/auth/social-login.use-case';
import { GoogleStrategy } from 'src/infrastructure/auth/strategies/google.strategy';
import { GithubStrategy } from 'src/infrastructure/auth/strategies/github.strategy';
import { RefreshUseCase } from 'src/application/use-cases/auth/refresh.use-case';
import { SetPasswordUseCase } from 'src/application/use-cases/auth/set-password.use-case';

@Module({
  imports: [
    UserModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    JwtAdapter,
    JwtStrategy,
    GoogleStrategy,
    GithubStrategy,
    {
      provide: LoginUseCase,
      useFactory: (userRepository: UserRepository, jwtAdapter: JwtAdapter) => {
        return new LoginUseCase(userRepository, jwtAdapter);
      },
      inject: [UserRepository, JwtAdapter],
    },
    {
      provide: RefreshUseCase,
      useFactory: (userRepository: UserRepository, jwtAdapter: JwtAdapter) => {
        return new RefreshUseCase(userRepository, jwtAdapter);
      },
      inject: [UserRepository, JwtAdapter],
    },
    {
      provide: SocialLoginUseCase,
      useFactory: (
        userRepository: UserRepository,
        jwtAdapter: JwtAdapter,
        configService: ConfigService,
      ) => {
        return new SocialLoginUseCase(
          userRepository,
          jwtAdapter,
          configService,
        );
      },
      inject: [UserRepository, JwtAdapter, ConfigService],
    },
    {
      provide: SetPasswordUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new SetPasswordUseCase(userRepository);
      },
      inject: [UserRepository],
    },
  ],
})
export class AuthModule { }
