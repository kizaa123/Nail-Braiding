import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import type { SessionUser } from '@beauty/types';
import { IS_PUBLIC_KEY } from '../decorators/public';
import { Errors } from '../errors';
import { loadEnv } from '../../config/env';
import { PrismaService } from '../../database/prisma.service';

interface AccessPayload {
  sub: string;
  role: SessionUser['role'];
  sid: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request & { user?: SessionUser }>();
    const env = loadEnv();
    const token = request.cookies?.[env.AUTH_COOKIE_NAME] as string | undefined;
    if (!token) throw Errors.unauthorized();

    let payload: AccessPayload;
    try {
      payload = await this.jwt.verifyAsync<AccessPayload>(token);
    } catch {
      throw Errors.unauthorized('Session expired. Please sign in again.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { customerProfile: true, professionalProfile: true, sessions: true },
    });

    if (!user || user.status !== 'ACTIVE') throw Errors.unauthorized();
    const session = user.sessions.find((s) => s.id === payload.sid && !s.revokedAt);
    if (!session || session.expiresAt < new Date()) throw Errors.unauthorized();

    request.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      emailVerified: Boolean(user.emailVerifiedAt),
      customerProfileId: user.customerProfile?.id,
      professionalProfileId: user.professionalProfile?.id,
    };
    return true;
  }
}
