import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { paginationQuerySchema } from '@beauty/validation';
import { Roles } from '../../common/decorators/roles';
import { CurrentUser } from '../../common/decorators/current-user';
import { ZodPipe } from '../../common/pipes/zod.pipe';
import type { SessionUser } from '@beauty/types';
import { AdminService } from './admin.service';
import { z } from 'zod';

@Controller('api/admin')
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('users')
  users(@Query(new ZodPipe(paginationQuerySchema)) query: z.infer<typeof paginationQuerySchema>) {
    return this.admin.users(query.cursor, query.limit);
  }

  @Patch('users/:id/status')
  setUserStatus(
    @CurrentUser() actor: SessionUser,
    @Param('id') id: string,
    @Body() body: { status: 'ACTIVE' | 'SUSPENDED' },
  ) {
    return this.admin.setUserStatus(actor.id, id, body.status);
  }

  @Get('professionals')
  professionals(@Query(new ZodPipe(paginationQuerySchema)) query: z.infer<typeof paginationQuerySchema>) {
    return this.admin.users(query.cursor, query.limit);
  }

  @Patch('professionals/:id/status')
  setProfessionalStatus(
    @CurrentUser() actor: SessionUser,
    @Param('id') id: string,
    @Body() body: { status: 'APPROVED' | 'REJECTED' | 'SUSPENDED'; reason?: string },
  ) {
    return this.admin.setProfessionalStatus(actor.id, id, body.status, body.reason);
  }

  @Get('bookings')
  bookings(@Query(new ZodPipe(paginationQuerySchema)) query: z.infer<typeof paginationQuerySchema>) {
    return this.admin.bookings(query.cursor, query.limit);
  }

  @Get('reviews')
  reviews(@Query(new ZodPipe(paginationQuerySchema)) query: z.infer<typeof paginationQuerySchema>) {
    return this.admin.reviews(query.cursor, query.limit);
  }

  @Get('reports')
  reports() {
    return this.admin.reports();
  }

  @Get('settings')
  settings() {
    return this.admin.settings();
  }

  @Patch('settings/:key')
  upsertSetting(
    @CurrentUser() actor: SessionUser,
    @Param('key') key: string,
    @Body() body: { value: unknown },
  ) {
    return this.admin.upsertSetting(actor.id, key, body.value);
  }
}
