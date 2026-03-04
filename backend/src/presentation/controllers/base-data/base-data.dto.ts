import { IsDefined, IsEnum, IsString } from 'class-validator';
import { BaseDataType } from 'src/domain/enums/base-data-type.enum';

export class UpsertBaseDataDto {
  @IsDefined({ message: 'A descrição é obrigatória' })
  @IsString({ message: 'A descrição deve ser um texto' })
  description: string;

  @IsDefined({ message: 'O tipo é obrigatório' })
  @IsEnum(BaseDataType, { message: 'Tipo inválido' })
  type: BaseDataType;
}
