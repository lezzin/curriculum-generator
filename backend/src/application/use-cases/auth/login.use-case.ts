import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { LoginInput } from 'src/application/models/login.input';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { JwtAdapter } from 'src/infrastructure/auth/jwt.service';

export class LoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtAdapter,
  ) { }

  async execute(body: LoginInput) {
    const user = await this.userRepository.findByEmail(body.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'Este usuário utiliza login social. Use seu provedor ou defina uma senha.',
      );
    }

    const passwordMatch = await bcrypt.compare(body.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const accessToken = this.jwtService.signAccessToken({
      sub: user.id,
      email: user.email,
      type: 'access_token'
    });

    const refreshToken = this.jwtService.signRefreshToken({
      sub: user.id,
      email: user.email,
      type: 'refresh_token'
    });

    user.refreshToken = refreshToken;
    await this.userRepository.update(user)

    return {
      accessToken,
      refreshToken,
      accessTokenExpiration: this.jwtService.getAccessTokenExpirationMs(),
      refreshTokenExpiration: this.jwtService.getRefreshTokenExpirationMs(),
    };
  }
}
