import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({ message: 'O nome é obrigatório', })
    @IsString({ message: 'O nome deve ser um texto válido.' })
    name: string;

    @IsNotEmpty({ message: 'O email é obrigatório', })
    @IsEmail()
    email: string

    @IsNotEmpty({ message: 'A senha é obrigatória', })
    @IsString({ message: 'A senha deve ser um texto', })
    @IsStrongPassword({
        minLength: 3,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 0
    })
    password: string;
}