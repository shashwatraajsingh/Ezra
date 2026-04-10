import { Type } from 'class-transformer';
import { IsArray, IsIn, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

class ResumeProjectFileDto {
    @IsString()
    id: string;

    @IsString()
    name: string;

    @IsString()
    @IsIn(['latex', 'bib', 'markdown'])
    language: 'latex' | 'bib' | 'markdown';

    @IsString()
    content: string;
}

export class UpdateResumeDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    latexSource?: string;

    @IsObject()
    @IsOptional()
    fieldValues?: Record<string, string>;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ResumeProjectFileDto)
    @IsOptional()
    projectFiles?: ResumeProjectFileDto[];
}
