import { ConfigService } from '@nestjs/config';
import { SocialLoginInput } from 'src/application/models/input/social-login.input';
import { UserProvider } from 'src/domain/entities/user-provider.entity';
import { User } from 'src/domain/entities/user.entity';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { JwtAdapter } from 'src/infrastructure/auth/jwt.service';

export class SocialLoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtAdapter,
    private readonly configService: ConfigService,
  ) {}

  async execute(input: SocialLoginInput) {
    const { provider, providerId, email, name, picture } = input;

    const userByProvider = await this.userRepository.findByProvider(
      provider,
      providerId,
    );

    if (userByProvider) {
      return this.generateTokens(userByProvider);
    }

    let user = await this.userRepository.findByEmail(email);

    if (!user) {
      user = new User(crypto.randomUUID(), name, email, picture);

      await this.userRepository.create(user);
    }

    const newProvider = new UserProvider(
      crypto.randomUUID(),
      user.id,
      provider,
      providerId,
    );

    user.addProvider(newProvider);

    await this.userRepository.update(user);

    return this.generateTokens(user);
  }

  private generateTokens(user: User) {
    const accessToken = this.jwtService.signAccessToken({
      sub: user.id,
      email: user.email,
      type: 'access_token',
    });

    const refreshToken = this.jwtService.signRefreshToken({
      sub: user.id,
      email: user.email,
      type: 'refresh_token',
    });

    return {
      accessToken,
      refreshToken,
      accessTokenExpiration: this.jwtService.getAccessTokenExpirationMs(),
      refreshTokenExpiration: this.jwtService.getRefreshTokenExpirationMs(),
      redirectUrl: this.configService.getOrThrow<string>('FRONTEND_URL'),
    };
  }
}
