import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { StudentDetail } from '../students/entities/student-detail.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(dto: SignUpDto): Promise<{
        accessToken: string;
    }>;
    signIn(req: {
        user: StudentDetail;
    }): Promise<{
        accessToken: string;
    }>;
}
