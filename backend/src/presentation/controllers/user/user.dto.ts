import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'O nome deve ser um texto válido.' })
  name: string;
}
