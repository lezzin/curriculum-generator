import {
  IsEnum,
  IsDefined,
  ValidateNested,
  IsString,
  IsUUID,
  IsOptional,
} from 'class-validator';
import {
  FocusArea,
  Language,
  Market,
  SelectedTemplate,
  TargetSeniority,
} from 'src/domain/shared/enums/resume.enums';
import { Type } from 'class-transformer';

export class ResumeOptionsDto {
  @IsDefined({ message: 'A linguagem é obrigatória' })
  @IsEnum(Language, { message: 'Linguagem inválida' })
  language: Language;

  @IsDefined({ message: 'A senioridade é obrigatória' })
  @IsEnum(TargetSeniority, { message: 'Senioridade inválida' })
  targetSeniority: TargetSeniority;

  @IsDefined({ message: 'A área de foco é obrigatória' })
  @IsEnum(FocusArea, { message: 'Área de foco inválida' })
  focusArea: FocusArea;

  @IsDefined({ message: 'O mercado é obrigatório' })
  @IsEnum(Market, { message: 'Mercado inválido' })
  market: Market;

  @IsDefined({ message: 'O template é obrigatório' })
  @IsEnum(SelectedTemplate, { message: 'Template inválido' })
  template: SelectedTemplate;
}

export class GenerateResumeDto {
  @IsDefined({ message: 'A descrição da vaga é obrigatória' })
  @IsString({ message: 'A descrição da vaga deve ser um texto' })
  jobDescription: string;

  @IsDefined({ message: 'As opções são obrigatórias' })
  @ValidateNested()
  @Type(() => ResumeOptionsDto)
  options: ResumeOptionsDto;
}

export class GetPageParamsDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsEnum(SelectedTemplate, { message: 'Template inválido' })
  template?: SelectedTemplate;
}
