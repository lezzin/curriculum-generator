import { UpdateUserInput } from "src/application/models/input/update-user.input";
import { GetUserOutput } from "src/application/models/output/get-user.output";
import { BadRequestException, ConflictException } from "src/domain/exceptions";
import { UserRepository } from "src/domain/repositories/user.repository";

export class UpdateUserUseCase {
    constructor(
        private userRepository: UserRepository,
    ) { }

    async execute(body: UpdateUserInput): Promise<GetUserOutput> {
        const { name, userId } = body;

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new BadRequestException('Usuário não encontrado');
        }

        if (user.name === name) {
            throw new ConflictException("Esse já é o seu nome atual!")
        }

        user.name = name;
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