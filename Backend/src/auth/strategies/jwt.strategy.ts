import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
    /** Subject — the student's numeric ID. */
    sub: number;
    email: string;
}

/**
 * Validates the Bearer token on every protected route.
 * The validated payload is attached to `req.user` by Passport.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
        });
    }

    validate(payload: JwtPayload): JwtPayload {
        return payload;
    }
}
