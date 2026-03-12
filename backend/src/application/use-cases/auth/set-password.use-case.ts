import { BadRequestException } from 'src/domain/exceptions';
import { SetPasswordInput } from 'src/application/models/input/auth.input';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { HashRepository } from 'src/domain/repositories/hash.repository';

export class SetPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashRepository: HashRepository,
  ) {}

  async execute(body: SetPasswordInput) {
    const user = await this.userRepository.findById(body.userId);

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    if (user.password) {
      throw new BadRequestException('Usuário já possui senha definida');
    }

    user.password = await this.hashRepository.hash(body.password);
    await this.userRepository.update(user);
  }
}
