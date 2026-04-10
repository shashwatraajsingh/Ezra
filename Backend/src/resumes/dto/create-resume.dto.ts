import { IsArray, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ResumeProjectFileDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsIn(['latex', 'bib', 'markdown'])
    language: 'latex' | 'bib' | 'markdown';

    @IsString()
    content: string;
}

export class CreateResumeDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    title: string;

    @IsNumber()
    @IsOptional()
    templateId?: number;

    @IsString()
    @IsOptional()
    latexSource?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ResumeProjectFileDto)
    @IsOptional()
    projectFiles?: ResumeProjectFileDto[];
}
