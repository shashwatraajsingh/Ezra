import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { StudentDetail } from '../students/entities/student-detail.entity';
import { JwtPayload } from './strategies/jwt.strategy';
import { getFirebaseAdminAuth } from './firebase-admin';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(StudentDetail)
        private readonly studentRepo: Repository<StudentDetail>,
        private readonly jwtService: JwtService,
    ) { }

    async signInWithGoogle(idToken: string): Promise<{ accessToken: string }> {
        const decoded = await getFirebaseAdminAuth().verifyIdToken(idToken).catch((error: unknown) => {
            if (error instanceof Error && error.message.includes('Missing Firebase Admin config')) {
                throw new InternalServerErrorException(error.message);
            }
            throw new UnauthorizedException('Invalid Firebase ID token');
        });

        if (!decoded.email) {
            throw new UnauthorizedException('Google account is missing an email address');
        }

        let student = await this.studentRepo.findOne({
            where: { email: decoded.email },
        });

        if (!student) {
            student = this.studentRepo.create({
                name: decoded.name ?? decoded.email.split('@')[0],
                email: decoded.email,
                password: `GOOGLE_AUTH_ONLY:${decoded.uid}`,
                branch: 'Not provided',
                college: 'Not provided',
            });
        } else if (decoded.name && student.name !== decoded.name) {
            student.name = decoded.name;
        }

        const saved = await this.studentRepo.save(student).catch(() => {
            throw new InternalServerErrorException('Could not complete Google sign-in. Please try again.');
        });

        return { accessToken: this.generateToken(saved) };
    }

    private generateToken(student: StudentDetail): string {
        const payload: JwtPayload = {
            sub: student.id,
            email: student.email,
            name: student.name,
            branch: student.branch,
            college: student.college,
            aiCredit: student.aiCredit,
            numberOfResumes: student.numberOfResumes,
        };
        return this.jwtService.sign(payload);
    }
}
