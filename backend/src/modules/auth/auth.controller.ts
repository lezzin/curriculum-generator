import { Controller, Post, Body, Res, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async signUp(
        @Body() signupDto: SignUpDto,
        @Res({ passthrough: true }) res,
    ) {
        const { token, user } = await this.authService.signUp(signupDto);

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false, // true em produção
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return user;
    }

    @Post('login')
    async signin(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) res,
    ) {
        const { token, user } = await this.authService.login(loginDto);

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false, // true em produção
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return user;
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(@Req() req) {
        return req.user;
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res) {
        res.clearCookie('authToken', {
            httpOnly: true,
            secure: false, // true em produção
            sameSite: 'lax',
        });

        return { message: 'Logged out successfully' };
    }
}