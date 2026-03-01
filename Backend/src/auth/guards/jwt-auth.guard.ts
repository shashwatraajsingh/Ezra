import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Protects routes that require a valid JWT Bearer token. */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }
