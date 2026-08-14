import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import type { Response } from 'express';
import type { SessionUser } from '@beauty/types';
import type { RegisterInput, LoginInput } from '@beauty/validation';
import { PrismaService } from '../../database/prisma.service';
import { EmailService } from '../notifications/email.service';
import { Errors } from '../../common/errors';
import { hashToken, randomToken, slugify } from '../../common/utils';
import { loadEnv } from '../../config/env';

const ARGON_OPTIONS: argon2.Options = {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly email: EmailService,
  ) {}

  async register(input: RegisterInput, _meta: { ip?: string; userAgent?: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw Errors.conflict('An account with this email already exists.');

    const passwordHash = await argon2.hash(input.password, ARGON_OPTIONS);
    const user = await this.prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email: input.email,
          passwordHash,
          role: input.role,
          roles: { create: { role: input.role } },
        },
      });

      if (input.role === 'CUSTOMER') {
        await tx.customerProfile.create({
          data: {
            userId: created.id,
            firstName: input.firstName,
            lastName: input.lastName,
            phone: input.phone,
          },
        });
      } else {
        const baseSlug = slugify(`${input.firstName} ${input.lastName} studio`) || 'professional';
        const slug = `${baseSlug}-${created.id.slice(0, 6)}`;
        const professional = await tx.professionalProfile.create({
          data: {
            userId: created.id,
            slug,
            businessName: `${input.firstName} ${input.lastName}`,
            phoneNumber: input.phone,
            status: 'PENDING',
          },
        });
        if (input.phone) {
          await tx.whatsAppContact.create({
            data: { professionalId: professional.id, phoneE164: input.phone, isActive: false },
          });
        }
      }
      return created;
    });

    const verifyToken = randomToken();
    await this.prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(verifyToken),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
    const env = loadEnv();
    await this.email.send({
      to: user.email,
      subject: 'Verify your Noir Atelier account',
      text: `Welcome. Verify your email: ${env.WEB_ORIGIN}/verify-email?token=${verifyToken}`,
    });

    return { id: user.id, email: user.email, role: user.role };
  }

  async login(input: LoginInput, res: Response, meta: { ip?: string; userAgent?: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
      include: { customerProfile: true, professionalProfile: true },
    });
    if (!user) throw Errors.unauthorized('Invalid email or password.');
    const valid = await argon2.verify(user.passwordHash, input.password);
    if (!valid) throw Errors.unauthorized('Invalid email or password.');
    if (user.status !== 'ACTIVE') throw Errors.forbidden('This account is not active.');

    const tokens = await this.issueSession(user.id, user.role, res, meta);
    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    return {
      user: this.toSessionUser(user),
      expiresAt: tokens.expiresAt,
    };
  }

  async logout(res: Response, sessionId?: string) {
    if (sessionId) {
      await this.prisma.session.updateMany({
        where: { id: sessionId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    this.clearCookies(res);
    return { ok: true };
  }

  async verifyEmail(token: string) {
    const tokenHash = hashToken(token);
    const record = await this.prisma.emailVerificationToken.findUnique({ where: { tokenHash } });
    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw Errors.validation('This verification link is invalid or expired.');
    }
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { emailVerifiedAt: new Date() },
      }),
      this.prisma.emailVerificationToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);
    return { verified: true };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return { sent: true };
    const token = randomToken();
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
    const env = loadEnv();
    await this.email.send({
      to: user.email,
      subject: 'Reset your Noir Atelier password',
      text: `Reset your password: ${env.WEB_ORIGIN}/reset-password?token=${token}`,
    });
    return { sent: true };
  }

  async resetPassword(token: string, password: string) {
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashToken(token) },
    });
    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw Errors.validation('This reset link is invalid or expired.');
    }
    const passwordHash = await argon2.hash(password, ARGON_OPTIONS);
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
      this.prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.session.updateMany({
        where: { userId: record.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
    return { reset: true };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { customerProfile: true, professionalProfile: true },
    });
    if (!user) throw Errors.notFound('User');
    return this.toSessionUser(user);
  }

  private async issueSession(
    userId: string,
    role: SessionUser['role'],
    res: Response,
    meta: { ip?: string; userAgent?: string },
  ) {
    const refreshToken = randomToken();
    const session = await this.prisma.session.create({
      data: {
        userId,
        refreshTokenHash: await argon2.hash(refreshToken, ARGON_OPTIONS),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ip: meta.ip,
        userAgent: meta.userAgent,
      },
    });
    const access = await this.jwt.signAsync({ sub: userId, role, sid: session.id });
    this.setCookies(res, access, refreshToken, session.id);
    return { expiresAt: session.expiresAt.toISOString() };
  }

  private setCookies(res: Response, access: string, refresh: string, sessionId: string) {
    const env = loadEnv();
    const isProd = env.NODE_ENV === 'production';
    const base = {
      httpOnly: true,
      secure: env.AUTH_COOKIE_SECURE || isProd,
      sameSite: 'lax' as const,
      path: '/',
      ...(env.AUTH_COOKIE_DOMAIN ? { domain: env.AUTH_COOKIE_DOMAIN } : {}),
    };
    res.cookie(env.AUTH_COOKIE_NAME, access, { ...base, maxAge: 15 * 60 * 1000 });
    res.cookie(`${env.AUTH_COOKIE_NAME}_refresh`, refresh, {
      ...base,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie(`${env.AUTH_COOKIE_NAME}_sid`, sessionId, {
      ...base,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private clearCookies(res: Response) {
    const env = loadEnv();
    const base = { httpOnly: true, path: '/' };
    res.clearCookie(env.AUTH_COOKIE_NAME, base);
    res.clearCookie(`${env.AUTH_COOKIE_NAME}_refresh`, base);
    res.clearCookie(`${env.AUTH_COOKIE_NAME}_sid`, base);
  }

  private toSessionUser(user: {
    id: string;
    email: string;
    role: SessionUser['role'];
    status: SessionUser['status'];
    emailVerifiedAt: Date | null;
    customerProfile: { id: string } | null;
    professionalProfile: { id: string } | null;
  }): SessionUser {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      emailVerified: Boolean(user.emailVerifiedAt),
      customerProfileId: user.customerProfile?.id,
      professionalProfileId: user.professionalProfile?.id,
    };
  }
}
