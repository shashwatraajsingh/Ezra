import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';
import { TemplateKind } from '../entities/template.entity';

export class CreateTemplateDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(500)
    description?: string;

    @IsEnum(TemplateKind)
    @IsOptional()
    kind?: TemplateKind;
}
