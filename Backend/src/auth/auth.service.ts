import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { StudentDetail } from '../students/entities/student-detail.entity';
import { SignUpDto } from './dto/signup.dto';
import { JwtPayload } from './strategies/jwt.strategy';

const BCRYPT_SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(StudentDetail)
        private readonly studentRepo: Repository<StudentDetail>,
        private readonly jwtService: JwtService,
    ) { }

    // ─── Sign Up ───────────────────────────────────────────────────────────────

    async signUp(dto: SignUpDto): Promise<{ accessToken: string }> {
        const exists = await this.studentRepo.findOne({ where: { email: dto.email } });

        if (exists) {
            throw new ConflictException('An account with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

        const student = this.studentRepo.create({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
            branch: dto.branch,
            college: dto.college,
        });

        const saved = await this.studentRepo.save(student).catch(() => {
            throw new InternalServerErrorException('Could not create account. Please try again.');
        });

        return { accessToken: this.generateToken(saved) };
    }

    // ─── Sign In ───────────────────────────────────────────────────────────────

    /**
     * Called by AuthController after LocalStrategy has already
     * validated the credentials and attached the student to `req.user`.
     */
    async signIn(student: StudentDetail): Promise<{ accessToken: string }> {
        return { accessToken: this.generateToken(student) };
    }

    // ─── Credential Validation (used by LocalStrategy) ─────────────────────────

    async validateStudent(email: string, password: string): Promise<StudentDetail | null> {
        const student = await this.studentRepo
            .createQueryBuilder('s')
            .addSelect('s.password') // password has select:false on the entity
            .where('s.email = :email', { email })
            .getOne();

        if (!student) return null;

        const passwordMatches = await bcrypt.compare(password, student.password);
        return passwordMatches ? student : null;
    }

    // ─── Private Helpers ───────────────────────────────────────────────────────

    private generateToken(student: StudentDetail): string {
        const payload: JwtPayload = { sub: student.id, email: student.email };
        return this.jwtService.sign(payload);
    }
}
