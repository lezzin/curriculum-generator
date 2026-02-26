import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { JwtAdapter } from 'src/infrastructure/auth/jwt.service';

export class LoginUseCase {
    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtAdapter,
    ) { }

    async execute(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

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