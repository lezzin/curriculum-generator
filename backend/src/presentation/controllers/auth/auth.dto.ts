import { IsEmail, IsDefined, IsString } from "class-validator";

export class LoginDto {
    @IsDefined({ message: 'O email é obrigatório', })
    @IsEmail()
    email: string;

    @IsDefined({ message: 'A senha é obrigatória', })
    @IsString({ message: 'A senha deve ser um texto', })
    password: string;
}
