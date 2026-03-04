import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { LoginUseCase } from 'src/application/use-cases/auth/login.use-case';
import { RefreshUseCase } from 'src/application/use-cases/auth/refresh.use-case';
import { SocialLoginUseCase } from 'src/application/use-cases/auth/social-login.use-case';
import { GetUserUseCase } from 'src/application/use-cases/user/get-user.use-case';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/infrastructure/auth/current-user.decorator';
import { LoginDto, SetPasswordDto, SignUpDto } from './auth.dto';
import { cookieOptions } from 'src/infrastructure/http/config/cookie.config';
import { SetPasswordUseCase } from 'src/application/use-cases/auth/set-password.use-case';
import { RegisterUserUseCase } from 'src/application/use-cases/user/register-user.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly refreshUseCase: RefreshUseCase,
    private readonly socialLoginUseCase: SocialLoginUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly setPasswordUseCase: SetPasswordUseCase,
  ) { }

  @Post('login')
  @HttpCode(HttpStatus.NO_CONTENT)
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const {
      accessToken,
      refreshToken,
      accessTokenExpiration,
      refreshTokenExpiration,
    } = await this.loginUseCase.execute(body);

    this.setAuthCookies(
      res,
      accessToken,
      accessTokenExpiration,
      refreshToken,
      refreshTokenExpiration,
    );
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() body: SignUpDto) {
    await this.registerUserUseCase.execute(body);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.NO_CONTENT)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token não encontrado!');
    }

    const {
      newAccessToken,
      newRefreshToken,
      newAccessTokenExpiration,
      newRefreshTokenExpiration,
    } = await this.refreshUseCase.execute({
      refresh_token: refreshToken,
    });

    this.setAuthCookies(
      res,
      newAccessToken,
      newAccessTokenExpiration,
      newRefreshToken,
      newRefreshTokenExpiration,
    );
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) res: Response) {
    this.clearAuthCookies(res);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser('id') userId: string) {
    return this.getUserUseCase.execute({ userId });
  }

  @Post('set-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async setPassword(
    @Body() body: SetPasswordDto,
    @CurrentUser('id') userId: string,
  ) {
    await this.setPasswordUseCase.execute({ userId, password: body.password });
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    return this.handleSocialCallback(req, res);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuth() { }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    return this.handleSocialCallback(req, res);
  }

  private async handleSocialCallback(req: Request, res: Response) {
    const {
      accessToken,
      accessTokenExpiration,
      redirectUrl,
      refreshToken,
      refreshTokenExpiration,
    } = await this.socialLoginUseCase.execute((req as any).user);

    this.setAuthCookies(
      res,
      accessToken,
      accessTokenExpiration,
      refreshToken,
      refreshTokenExpiration,
    );

    return res.redirect(redirectUrl);
  }

  private setAuthCookies(
    res: Response,
    accessToken: string,
    accessMaxAge: number,
    refreshToken?: string,
    refreshMaxAge?: number,
  ) {
    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: accessMaxAge,
    });

    if (refreshToken && refreshMaxAge) {
      res.cookie('refreshToken', refreshToken, {
        ...cookieOptions,
        maxAge: refreshMaxAge,
      });
    }
  }

  private clearAuthCookies(res: Response) {
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
  }
}
