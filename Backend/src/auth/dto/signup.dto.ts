import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    /**
     * Must be a valid e-mail address.
     * The platform primarily targets Gmail, but any valid e-mail is accepted.
     */
    @IsEmail({}, { message: 'Please provide a valid e-mail address' })
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    })
    password: string;

    @IsString()
    @IsNotEmpty()
    branch: string;

    @IsString()
    @IsNotEmpty()
    college: string;
}
