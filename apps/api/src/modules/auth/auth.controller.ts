import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from '@beauty/validation';
import { Public } from '../../common/decorators/public';
import { CurrentUser } from '../../common/decorators/current-user';
import { ZodPipe } from '../../common/pipes/zod.pipe';
import type { SessionUser } from '@beauty/types';
import { AuthService } from './auth.service';
import { loadEnv } from '../../config/env';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('register')
  register(
    @Body(new ZodPipe(registerSchema)) body: ReturnType<typeof registerSchema.parse>,
    @Req() req: Request,
  ) {
    return this.auth.register(body, {
      ip: req.ip,
      userAgent: req.get('user-agent') ?? undefined,
    });
  }

  @Public()
  @Post('login')
  login(
    @Body(new ZodPipe(loginSchema)) body: ReturnType<typeof loginSchema.parse>,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.login(body, res, {
      ip: req.ip,
      userAgent: req.get('user-agent') ?? undefined,
    });
  }

  @Public()
  @Post('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const env = loadEnv();
    const sid = req.cookies?.[`${env.AUTH_COOKIE_NAME}_sid`] as string | undefined;
    return this.auth.logout(res, sid);
  }

  @Public()
  @Post('verify-email')
  verifyEmail(@Body(new ZodPipe(verifyEmailSchema)) body: { token: string }) {
    return this.auth.verifyEmail(body.token);
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body(new ZodPipe(forgotPasswordSchema)) body: { email: string }) {
    return this.auth.forgotPassword(body.email);
  }

  @Public()
  @Post('reset-password')
  resetPassword(@Body(new ZodPipe(resetPasswordSchema)) body: { token: string; password: string }) {
    return this.auth.resetPassword(body.token, body.password);
  }

  @Get('me')
  me(@CurrentUser() user: SessionUser) {
    return this.auth.me(user.id);
  }
}
