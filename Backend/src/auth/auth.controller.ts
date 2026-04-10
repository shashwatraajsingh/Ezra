import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { GoogleSignInDto } from './dto/google-signin.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('google')
    signInWithGoogle(@Body() dto: GoogleSignInDto) {
        return this.authService.signInWithGoogle(dto.idToken);
    }
}
