import { Controller, Post, Body, Res, Get, UseGuards } from '@nestjs/common';
import { LoginUseCase } from 'src/application/use-cases/auth/login.use-case';
import type { Response } from 'express';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';
import { CurrentUser } from 'src/infrastructure/auth/current-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private loginUseCase: LoginUseCase) { }

    @Post('login')
    async login(
        @Body() body: { email: string; password: string },
        @Res({ passthrough: true }) res: Response,
    ) {
        const { access_token } = await this.loginUseCase.execute(
            body.email,
            body.password,
        );

        res.cookie('authToken', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        });

        return { message: 'Login realizado com sucesso' };
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('authToken', {
            httpOnly: true,
            secure: false, // true em produção
            sameSite: 'lax',
        });

        return { message: 'Deslogado com sucesso!' };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(@CurrentUser() user: any) {
        return user;
    }
}