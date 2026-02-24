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

        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('Token não informado');
        }

        const [type, token] = authHeader.split(' ');

        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException('Formato de token inválido');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET'),
            });

            request['user'] = payload;

            return true;
        } catch (error) {
            throw new UnauthorizedException('Token inválido ou expirado');
        }
    }
}