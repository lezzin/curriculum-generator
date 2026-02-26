import { Controller, Post, Body } from '@nestjs/common';
import { RegisterUserUseCase } from 'src/application/use-cases/user/register-user.use-case';

@Controller('user')
export class UserController {
    constructor(private registerUserUseCase: RegisterUserUseCase) { }

    @Post('create')
    async signUp(
        @Body() body: { name: string, email: string; password: string },
    ) {
        await this.registerUserUseCase.execute(
            body.name,
            body.email,
            body.password
        );

        return { message: 'Usuário criado com sucesso!' };
    }
}