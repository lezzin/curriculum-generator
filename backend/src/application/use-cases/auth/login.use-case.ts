import { UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { LoginInput } from 'src/application/models/login.input';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { JwtAdapter } from 'src/infrastructure/auth/jwt.service';
import { LoginDto } from 'src/presentation/controllers/auth/auth.dto';

export class LoginUseCase {
    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtAdapter,
    ) { }

    async execute(body: LoginInput) {
        const user = await this.userRepository.findByEmail(body.email);

        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        // TODO validar isso aqui
        if (!user.password) {
            throw new UnauthorizedException(
                'Este usuário utiliza login social. Use seu provedor ou defina uma senha.'
            );
        }

        const passwordMatch = await bcrypt.compare(body.password, user.password);

        if (!passwordMatch) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
        });

        return {
            access_token: token,
        };
    }
}