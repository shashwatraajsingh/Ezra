import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { StudentDetail } from '../students/entities/student-detail.entity';
export declare class AuthService {
    private readonly studentRepo;
    private readonly jwtService;
    constructor(studentRepo: Repository<StudentDetail>, jwtService: JwtService);
    signInWithGoogle(idToken: string): Promise<{
        accessToken: string;
    }>;
    private generateToken;
}
