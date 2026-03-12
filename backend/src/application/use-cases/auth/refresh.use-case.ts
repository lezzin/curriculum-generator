import { UnauthorizedException } from 'src/domain/exceptions';
import { RefreshInput } from 'src/application/models/input/auth.input';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { JwtAdapter } from 'src/infrastructure/auth/jwt.service';
import { HashRepository } from 'src/domain/repositories/hash.repository';

export class RefreshUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtAdapter,
    private readonly hashRepository: HashRepository,
  ) {}

  async execute(body: RefreshInput) {
    const payload = this.jwtService.verifyRefreshToken(body.refresh_token);

    if (payload.type !== 'refresh_token') {
      throw new UnauthorizedException('Tipo de token inválido!');
    }

    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    if (!user.refreshToken) {
      throw new UnauthorizedException('Refresh token não cadastrado');
    }

    const refreshTokenMatch = await this.hashRepository.compare(
      body.refresh_token,
      user.refreshToken,
    );

    if (!refreshTokenMatch) {
      throw new UnauthorizedException('Refresh token inválido!');
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

    user.refreshToken = await this.hashRepository.hash(newRefreshToken);
    await this.userRepository.update(user);

    return {
      newAccessToken,
      newRefreshToken,
      newAccessTokenExpiration: this.jwtService.getAccessTokenExpirationMs(),
      newRefreshTokenExpiration: this.jwtService.getRefreshTokenExpirationMs(),
    };
  }
}
