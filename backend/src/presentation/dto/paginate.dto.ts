import { Type } from "class-transformer";
import { IsDefined, Min } from "class-validator";

export class PaginateDto {
    @IsDefined({ message: 'A página é obrigatória' })
    @Type(() => Number)
    @Min(1, { message: 'A página não pode ser menor do que 1' })
    page: number;

    @Type(() => Number)
    @IsDefined({ message: 'O limite é obrigatório' })
    @Min(10, { message: 'O limite não pode ser menor do que 10' })
    limit: number;
}
