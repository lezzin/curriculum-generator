import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { BaseType } from "../enum/base-type.enum";

export class CreateDto {
    @IsString()
    @IsNotEmpty()
    description: string

    @IsEnum(BaseType)
    @IsNotEmpty()
    type: BaseType
}

export class RemoveDto {
    @IsEnum(BaseType)
    @IsNotEmpty()
    type: BaseType
}
