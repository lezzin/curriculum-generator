import { Transform } from 'class-transformer';
import { IsOptional, IsPhoneNumber, IsUrl } from 'class-validator';

export class UpsertUserConfigDto {
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsUrl()
  github?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsUrl()
  portfolio?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsPhoneNumber('BR')
  cellphone?: string;
}
