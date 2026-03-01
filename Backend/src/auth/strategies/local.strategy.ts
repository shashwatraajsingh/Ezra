import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { StudentDetail } from '../../students/entities/student-detail.entity';

/**
 * Handles the initial credential check on POST /auth/signin.
 * Passport calls `validate()` automatically before the route handler runs.
 * On success the returned student is attached to `req.user`.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        // Tell passport-local to look for "email" instead of the default "username"
        super({ usernameField: 'email' });
    }

    async validate(email: string, password: string): Promise<StudentDetail> {
        const student = await this.authService.validateStudent(email, password);

        if (!student) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return student;
    }
}
