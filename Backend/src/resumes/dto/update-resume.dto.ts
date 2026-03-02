import { IsObject, IsOptional, IsString } from 'class-validator';

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
}
