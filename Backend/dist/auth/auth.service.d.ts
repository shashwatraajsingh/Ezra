import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { StudentDetail } from '../students/entities/student-detail.entity';
import { SignUpDto } from './dto/signup.dto';
export declare class AuthService {
    private readonly studentRepo;
    private readonly jwtService;
    constructor(studentRepo: Repository<StudentDetail>, jwtService: JwtService);
    signUp(dto: SignUpDto): Promise<{
        accessToken: string;
    }>;
    signIn(student: StudentDetail): Promise<{
        accessToken: string;
    }>;
    validateStudent(email: string, password: string): Promise<StudentDetail | null>;
    private generateToken;
}
