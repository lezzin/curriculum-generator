import { BadRequestException } from 'src/domain/exceptions';
import { SetPasswordInput } from 'src/application/models/input/auth.input';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { HashRepository } from 'src/domain/repositories/hash.repository';
import { GetUserOutput } from 'src/application/models/output/get-user.output';

export class SetPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashRepository: HashRepository,
  ) { }

  async execute(body: SetPasswordInput): Promise<GetUserOutput> {
    const user = await this.userRepository.findById(body.userId);

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    if (user.password) {
      throw new BadRequestException('Usuário já possui senha definida');
    }

    user.password = await this.hashRepository.hash(body.password);
    await this.userRepository.update(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      onlyProvider: user.password == null,
      isAdmin: user.isAdmin(),
    };
  }
}
