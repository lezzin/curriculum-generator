import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    signUp(@Body() signupDto: SignUpDto) {
        return this.authService.signUp(signupDto);
    }

    @Post('login')
    signin(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}