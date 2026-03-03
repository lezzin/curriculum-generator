import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import ms from 'ms';

type AuthTokenType = 'refresh_token' | 'access_token';

export interface AuthUserData {
  sub: string;
  email: string;
  type: AuthTokenType;
}

@Injectable()
export class JwtAdapter {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  signAccessToken(payload: AuthUserData): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.getOrThrow<ms.StringValue>(
        'JWT_ACCESS_EXPIRES_IN',
      ),
    });
  }

  signRefreshToken(payload: AuthUserData): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.getOrThrow<ms.StringValue>(
        'JWT_REFRESH_EXPIRES_IN',
      ),
    });
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verify(token, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
    });
  }

  getAccessTokenExpirationMs(): number {
    const expiresIn = this.configService.getOrThrow<ms.StringValue>(
      'JWT_ACCESS_EXPIRES_IN',
    );

    return ms(expiresIn);
  }

  getRefreshTokenExpirationMs(): number {
    const expiresIn = this.configService.getOrThrow<ms.StringValue>(
      'JWT_REFRESH_EXPIRES_IN',
    );

    return ms(expiresIn);
  }
}
