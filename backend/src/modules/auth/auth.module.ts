import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { StringValue } from "ms";
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.getOrThrow<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.getOrThrow<StringValue>('JWT_EXPIRES')
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtAuthGuard],
    exports: [JwtAuthGuard, JwtModule],
})
export class AuthModule { }