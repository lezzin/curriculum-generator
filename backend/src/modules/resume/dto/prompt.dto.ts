import {
  IsNotEmpty,
  IsString,
  IsEnum,
  ValidateNested,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum Language {
  PT = 'PT',
  EN = 'EN',
}

export enum TargetSeniority {
  JUNIOR = 'Junior',
  MID_LEVEL = 'Mid-level',
}

export enum FocusArea {
  BACKEND = 'Backend',
  FULLSTACK = 'Fullstack',
  MICROSERVICES = 'Microservices',
  DEVOPS = 'DevOps',
}

export enum Market {
  BRAZIL = 'Brazil',
  US = 'US',
  EUROPE = 'Europe',
}

export class ResumeOptionsDto {
  @IsEnum(Language, { message: 'Idioma inválido.' })
  language: Language;

  @IsEnum(TargetSeniority, { message: 'Senioridade alvo inválida.' })
  targetSeniority: TargetSeniority;

  @IsEnum(FocusArea, { message: 'Área de foco inválida.' })
  focusArea: FocusArea;

  @IsEnum(Market, { message: 'Mercado inválido.' })
  market: Market;
}

export class GenerateDto {
  @IsNotEmpty({ message: 'A descrição da vaga é obrigatória.' })
  @IsString({ message: 'A descrição da vaga deve ser um texto.' })
  jobDescription: string;

  @IsNotEmpty({ message: 'As opções do currículo são obrigatórias.' })
  @ValidateNested({ message: 'As opções enviadas são inválidas.' })
  @Type(() => ResumeOptionsDto)
  options: ResumeOptionsDto;
}

class ExperienceDto {
  @IsString({ message: 'O título da experiência deve ser um texto.' })
  title: string;

  @IsString({ message: 'O nome da empresa deve ser um texto.' })
  company: string;

  @IsString({ message: 'O período deve ser um texto.' })
  period: string;

  @IsArray({ message: 'As responsabilidades devem ser uma lista.' })
  @IsString({ each: true, message: 'Cada responsabilidade deve ser um texto.' })
  responsibilities: string[];

  @IsArray({ message: 'As tecnologias devem ser uma lista.' })
  @IsString({ each: true, message: 'Cada tecnologia deve ser um texto.' })
  technologies: string[];
}

class ProjectDto {
  @IsString({ message: 'O nome do projeto deve ser um texto.' })
  name: string;

  @IsArray({ message: 'Os destaques devem ser uma lista.' })
  @IsString({ each: true, message: 'Cada destaque deve ser um texto.' })
  highlights: string[];

  @IsArray({ message: 'As tecnologias do projeto devem ser uma lista.' })
  @IsString({ each: true, message: 'Cada tecnologia deve ser um texto.' })
  technologies: string[];
}

export class ResumePdfDto {
  @IsString({ message: 'O nome deve ser um texto.' })
  name: string;

  @IsEnum(Language, { message: 'Idioma inválido.' })
  language: Language;

  @IsString({ message: 'O cargo deve ser um texto.' })
  role: string;

  @IsString({ message: 'O resumo deve ser um texto.' })
  summary: string;

  @IsArray({ message: 'As habilidades devem ser uma lista.' })
  @IsString({ each: true, message: 'Cada habilidade deve ser um texto.' })
  skills: string[];

  @ValidateNested({ each: true, message: 'Experiência inválida.' })
  @Type(() => ExperienceDto)
  experiences: ExperienceDto[];

  @IsOptional()
  @ValidateNested({ each: true, message: 'Projeto inválido.' })
  @Type(() => ProjectDto)
  projects?: ProjectDto[];
}
