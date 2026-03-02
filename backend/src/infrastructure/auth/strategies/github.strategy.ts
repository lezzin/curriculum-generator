import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getOrThrow('GITHUB_CLIENT_ID'),
      clientSecret: configService.getOrThrow('GITHUB_SECRET'),
      callbackURL: 'http://localhost:3000/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const primaryEmail =
      profile.emails?.find((e) => e.primary)?.value ||
      profile.emails?.[0]?.value;

    return {
      provider: 'github',
      providerId: profile.id,
      email: primaryEmail,
      name: profile.username,
      picture: profile.photos?.[0]?.value,
    };
  }
}
