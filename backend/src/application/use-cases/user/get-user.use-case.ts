import { GetUserInput } from 'src/application/models/get-user.input';
import { UserRepository } from 'src/domain/repositories/user.repository';

export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(body: GetUserInput) {
    return await this.userRepository.findById(body.sub);
  }
}
