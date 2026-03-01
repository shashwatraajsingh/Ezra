import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
    @IsEmail({}, { message: 'Please provide a valid e-mail address' })
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
