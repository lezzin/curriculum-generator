import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { CreateUserInput } from 'src/application/models/create-user.input';
import { User } from 'src/domain/entities/user.entity';
import { UserRepository } from 'src/domain/repositories/user.repository';

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) { }

  async execute(body: CreateUserInput) {
    const user = await this.userRepository.findByEmail(body.email);

    if (user) {
      throw new ConflictException('Email já está em uso');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    await this.userRepository.create(
      new User(randomUUID(), body.name, body.email, null, hashedPassword),
    );
  }
}
