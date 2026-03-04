import { Type } from 'class-transformer';
import { IsDefined, IsNumber, IsString, Max, Min } from 'class-validator';

export class GenerateReportDto {
    @IsDefined({ message: 'O campo page é obrigatório.' })
    @IsNumber({}, { message: 'O campo page deve ser um número.' })
    @Min(1, { message: 'O campo page deve ser maior ou igual a 1.' })
    @Type(() => Number)
    page: number;

    @IsDefined({ message: 'O campo limit é obrigatório.' })
    @IsNumber({}, { message: 'O campo limit deve ser um número.' })
    @Min(1, { message: 'O campo limit deve ser maior ou igual a 1.' })
    @Max(100, { message: 'O campo limit deve ser menor ou igual a 100.' })
    @Type(() => Number)
    limit: number;

    @IsDefined({ message: 'O campo initial_date_creation é obrigatório.' })
    @IsString({ message: 'O campo initial_date_creation deve ser uma string.' })
    initial_date_creation: string;

    @IsDefined({ message: 'O campo final_date_creation é obrigatório.' })
    @IsString({ message: 'O campo final_date_creation deve ser uma string.' })
    final_date_creation: string;
}