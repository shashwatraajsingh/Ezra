import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { StudentDetail } from '../students/entities/student-detail.entity';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * POST /auth/signup
     * Register a new student account.
     * Returns a signed JWT on success.
     */
    @Post('signup')
    signUp(@Body() dto: SignUpDto) {
        return this.authService.signUp(dto);
    }

    /**
     * POST /auth/signin
     * Authenticate with email + password.
     * LocalAuthGuard runs LocalStrategy first — if credentials are wrong
     * it throws 401 before this handler is ever reached.
     * Returns a signed JWT on success.
     */
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signIn(@Request() req: { user: StudentDetail }) {
        return this.authService.signIn(req.user);
    }
}
