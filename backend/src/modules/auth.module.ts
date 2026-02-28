import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from '../infrastructure/auth/jwt.strategy';

import { UserModule } from './user.module';
import { UserRepository } from '../domain/repositories/user.repository';
import { AuthController } from 'src/presentation/controllers/auth/auth.controller';
import { LoginUseCase } from 'src/application/use-cases/auth/login.use-case';
import { JwtAdapter } from 'src/infrastructure/auth/jwt.service';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from "ms";

@Module({
    imports: [
        UserModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
                signOptions: { expiresIn: configService.getOrThrow<StringValue>('JWT_ACCESS_EXPIRES_IN') },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [
        LoginUseCase,
        JwtAdapter,
        JwtStrategy,
        {
            provide: LoginUseCase,
            useFactory: (
                userRepository: UserRepository,
                jwtAdapter: JwtAdapter,
            ) => {
                return new LoginUseCase(userRepository, jwtAdapter);
            },
            inject: [UserRepository, JwtAdapter],
        },
    ],
})
export class AuthModule { }