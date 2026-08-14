import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import type { SessionUser, UserRole } from '@beauty/types';
import { ROLES_KEY } from '../decorators/roles';
import { Errors } from '../errors';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length === 0) return true;
    const request = context.switchToHttp().getRequest<Request & { user?: SessionUser }>();
    if (!request.user) throw Errors.unauthorized();
    if (!roles.includes(request.user.role)) throw Errors.forbidden();
    return true;
  }
}
