import { Controller, Post, Body } from '@nestjs/common';
import { RegisterUserUseCase } from 'src/application/use-cases/user/register-user.use-case';
import { CreateUserDto } from './user.dto';

@Controller('user')
export class UserController {
    constructor(private registerUserUseCase: RegisterUserUseCase) { }

    @Post('create')
    async signUp(
        @Body() body: CreateUserDto,
    ) {
        await this.registerUserUseCase.execute(body);
        return { message: 'Usuário criado com sucesso!' };
    }
}