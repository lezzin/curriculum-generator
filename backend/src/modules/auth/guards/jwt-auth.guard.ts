import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const authToken = request.cookies.authToken;

        if (!authToken) {
            throw new UnauthorizedException('Token não informado');
        }

        try {
            const payload = await this.jwtService.verifyAsync(authToken, {
                secret: this.configService.get('JWT_SECRET'),
            });

            request['user'] = payload;

            return true;
        } catch (error) {
            throw new UnauthorizedException('Token inválido ou expirado');
        }
    }
}