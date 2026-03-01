import { Controller, Post, Body, Res, Get, UseGuards, Req } from '@nestjs/common';
import { LoginUseCase } from 'src/application/use-cases/auth/login.use-case';
import type { Response } from 'express';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';
import { CurrentUser } from 'src/infrastructure/auth/current-user.decorator';
import { LoginDto } from './auth.dto';
import { cookieOptions } from 'src/domain/shared/config/cookie.config';
import { AuthGuard } from '@nestjs/passport';
import { SocialLoginUseCase } from 'src/application/use-cases/auth/social-login.use-case';
import { GetUserUseCase } from 'src/application/use-cases/user/get-user.use-case';

@Controller('auth')
export class AuthController {
    constructor(
        private loginUseCase: LoginUseCase,
        private socialLoginUseCase: SocialLoginUseCase,
        private getUserUseCase: GetUserUseCase,
    ) { }

    @Post('login')
    async login(
        @Body() body: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { access_token } = await this.loginUseCase.execute(body);

        res.cookie('authToken', access_token, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000,
        });

        return { message: 'Login realizado com sucesso' };
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('authToken', cookieOptions);
        return { message: 'Deslogado com sucesso!' };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(@CurrentUser() user: any) {
        return this.getUserUseCase.execute(user)
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleCallback(@Req() req: any, @Res() res: Response) {
        const { access_token, redirect_url } = await this.socialLoginUseCase.execute(req?.user)

        res.cookie('authToken', access_token, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000,
        });

        return res.redirect(redirect_url)
    }

    @Get('github')
    @UseGuards(AuthGuard('github'))
    async githubAuth() { }

    @Get('github/callback')
    @UseGuards(AuthGuard('github'))
    async githubCallback(@Req() req: any, @Res() res: Response) {
        const { access_token, redirect_url } = await this.socialLoginUseCase.execute(req?.user)

        res.cookie('authToken', access_token, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000,
        });

        return res.redirect(redirect_url)
    }
}