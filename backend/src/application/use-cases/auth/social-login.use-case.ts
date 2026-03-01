import { ConfigService } from '@nestjs/config';
import { SocialLoginInput } from 'src/application/models/social-login.input';
import { UserProvider } from 'src/domain/entities/user-provider.entity';
import { User } from 'src/domain/entities/user.entity';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { JwtAdapter } from 'src/infrastructure/auth/jwt.service';

export class SocialLoginUseCase {
    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtAdapter,
        private configService: ConfigService,
    ) { }

    async execute(input: SocialLoginInput) {
        const { provider, providerId, email, name, picture } = input

        const userByProvider = await this.userRepository.findByProvider(provider, providerId)
        if (userByProvider) {
            return this.generateToken(userByProvider)
        }

        let user = await this.userRepository.findByEmail(email)

        if (!user) {
            user = new User(
                crypto.randomUUID(),
                name,
                email,
                picture,
            )

            await this.userRepository.create(user)
        }

        const newProvider = new UserProvider(
            crypto.randomUUID(),
            user.id,
            provider,
            providerId,
        )

        user.addProvider(newProvider)
        user = await this.userRepository.create(user)

        return this.generateToken(user)
    }

    private generateToken(user: User) {
        const access_token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
        })

        return {
            access_token,
            redirect_url: this.configService.getOrThrow('FRONTEND_URL')
        }
    }
}