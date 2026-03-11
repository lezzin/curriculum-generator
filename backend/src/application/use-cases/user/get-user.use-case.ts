import { GetUserInput } from 'src/application/models/input/get-user.input';
import { GetUserOutput } from 'src/application/models/output/get-user.output';
import { NotFoundException } from 'src/domain/exceptions';
import { UserRepository } from 'src/domain/repositories/user.repository';

export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(body: GetUserInput): Promise<GetUserOutput> {
    const user = await this.userRepository.findById(body.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

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
