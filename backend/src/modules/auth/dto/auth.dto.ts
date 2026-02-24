import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class LoginDto {
    @IsNotEmpty({
        message: 'O email é obrigatório',
    })
    @IsEmail()
    email: string;

    @IsNotEmpty({
        message: 'A senha é obrigatória',
    })
    @IsString({
        message: 'A senha deve ser um texto',
    })
    password: string;
}

export class SignUpDto {
    @IsNotEmpty({
        message: 'O nome é obrigatório',
    })
    @IsString({
        message: 'O nome deve ser um texto',
    })
    name: string;

    @IsNotEmpty({
        message: 'O email é obrigatório',
    })
    @IsEmail()
    email: string;

    @IsNotEmpty({
        message: 'A senha é obrigatória',
    })
    @IsStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
    }, {
        message: 'A senha deve conter pelo menos 6 caracteres, incluindo letras maiúsculas, minúsculas e números',
    })
    password: string;
}