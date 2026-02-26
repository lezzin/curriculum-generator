import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { User } from 'src/domain/entities/user.entity';
import { UserRepository } from 'src/domain/repositories/user.repository';

export class RegisterUserUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute(name: string, email: string, password: string) {
        const user = await this.userRepository.findByEmail(email);

        if (user) {
            throw new ConflictException('Email já está em uso');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await this.userRepository.create(new User(
            randomUUID(),
            name,
            email,
            hashedPassword
        ))
    }
}