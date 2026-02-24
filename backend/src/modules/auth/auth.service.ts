import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { LoginDto, SignUpDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async signUp(signupDto: SignUpDto) {
        const { name, email, password } = signupDto;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.userRepository.save({
            name,
            email,
            password: hashedPassword,
        });

        const token = this.jwtService.sign(
            { id: user.id },
            {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRES'),
            },
        );

        return {
            token,
        };
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const user = await this.userRepository.findOneBy({ email });

        if (!user) {
            throw new UnauthorizedException('invalid email or password');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw new UnauthorizedException('invalid email or password');
        }

        const token = this.jwtService.sign(
            { id: user.id },
            {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRES'),
            },
        );

        return { token };
    }
}