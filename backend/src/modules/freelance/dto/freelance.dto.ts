import {
    IsNotEmpty,
    IsString,
} from "class-validator";

export class SolicitationDto {
    @IsNotEmpty({ message: "A descrição da solitação é obrigatória." })
    @IsString({ message: "A descrição da solitação deve ser um texto." })
    solicitation: string;
}
