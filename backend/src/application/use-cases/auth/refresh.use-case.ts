import { UnauthorizedException } from '@nestjs/common';
import { RefreshInput } from 'src/application/models/refresh.input';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { JwtAdapter } from 'src/infrastructure/auth/jwt.service';

export class RefreshUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtAdapter,
  ) { }

  async execute(body: RefreshInput) {
    const verify = this.jwtService.verifyRefreshToken(body.refresh_token);

    if (verify.type !== 'refresh_token') {
      throw new UnauthorizedException('Tipo de token inválido!');
    }

    const user = await this.userRepository.findByRefreshToken(verify.sub, body.refresh_token);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const newAccessToken = this.jwtService.signAccessToken({
      sub: user.id,
      email: user.email,
      type: 'access_token',
    });

    const newRefreshToken = this.jwtService.signRefreshToken({
      sub: user.id,
      email: user.email,
      type: 'refresh_token',
    });

    user.refreshToken = newRefreshToken;
    await this.userRepository.update(user);

    return {
      newAccessToken,
      newRefreshToken,
      newAccessTokenExpiration: this.jwtService.getAccessTokenExpirationMs(),
      newRefreshTokenExpiration: this.jwtService.getRefreshTokenExpirationMs(),
    };
  }
}