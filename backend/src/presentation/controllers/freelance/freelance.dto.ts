import { IsDefined, IsString } from "class-validator"

export class GenerateProposalDto {
    @IsDefined({ message: 'A solicitação é obrigatória', })
    @IsString({ message: 'A solicitação deve ser um texto', })
    solicitation: string
}