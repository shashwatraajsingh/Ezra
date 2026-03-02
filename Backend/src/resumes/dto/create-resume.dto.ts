import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

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
}
