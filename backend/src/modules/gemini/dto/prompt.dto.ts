import {
    IsNotEmpty,
    IsString,
    IsEnum,
    ValidateNested,
    IsArray,
    IsOptional,
} from "class-validator";
import { Type } from "class-transformer";

export enum Language {
    PT = "PT",
    EN = "EN",
}

export enum TargetSeniority {
    JUNIOR = "Junior",
    MID_LEVEL = "Mid-level",
}

export enum FocusArea {
    BACKEND = "Backend",
    FULLSTACK = "Fullstack",
    MICROSERVICES = "Microservices",
    DEVOPS = "DevOps",
}

export enum Market {
    BRAZIL = "Brazil",
    US = "US",
    EUROPE = "Europe",
}

export class ResumeOptionsDto {
    @IsEnum(Language)
    language: Language;

    @IsEnum(TargetSeniority)
    targetSeniority: TargetSeniority;

    @IsEnum(FocusArea)
    focusArea: FocusArea;

    @IsEnum(Market)
    market: Market;
}

export class GenerateDto {
    @IsNotEmpty()
    @IsString()
    jobDescription: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => ResumeOptionsDto)
    options: ResumeOptionsDto;
}
class ExperienceDto {
    @IsString()
    title: string;

    @IsString()
    company: string;

    @IsString()
    period: string;

    @IsString()
    description: string;

    @IsArray()
    technologies: string[];
}

class ProjectDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsArray()
    technologies: string[];
}

export class ResumePdfDto {
    @IsString()
    name: string;

    @IsString()
    role: string;

    @IsString()
    summary: string;

    @IsArray()
    skills: string[];

    @ValidateNested({ each: true })
    @Type(() => ExperienceDto)
    experiences: ExperienceDto[];

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProjectDto)
    projects?: ProjectDto[];
}