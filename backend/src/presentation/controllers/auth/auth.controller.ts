import { Controller, Post, Body, Res } from '@nestjs/common';
import { LoginUseCase } from 'src/application/use-cases/auth/login.use-case';
import type { Response } from 'express';

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
}