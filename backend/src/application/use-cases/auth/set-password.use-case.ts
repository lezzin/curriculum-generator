import { BadRequestException } from 'src/domain/exceptions';
import * as bcrypt from 'bcryptjs';
import { SetPasswordInput } from 'src/application/models/input/set-password.input';
import { UserRepository } from 'src/domain/repositories/user.repository';

export class SetPasswordUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(body: SetPasswordInput) {
    const user = await this.userRepository.findById(body.userId);

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    if (user.password) {
      throw new BadRequestException('Usuário já possui senha definida');
    }

    user.password = await bcrypt.hash(body.password, 10);
    await this.userRepository.update(user);
  }
}
