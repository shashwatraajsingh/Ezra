import { AuthService } from './auth.service';
import { GoogleSignInDto } from './dto/google-signin.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signInWithGoogle(dto: GoogleSignInDto): Promise<{
        accessToken: string;
    }>;
}
