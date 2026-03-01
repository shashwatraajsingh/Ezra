import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Triggers LocalStrategy to validate email + password before the route handler runs. */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') { }
