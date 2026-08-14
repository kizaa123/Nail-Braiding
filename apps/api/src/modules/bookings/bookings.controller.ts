import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { bookingCreateSchema, bookingStatusUpdateSchema, paginationQuerySchema } from '@beauty/validation';
import { Roles } from '../../common/decorators/roles';
import { CurrentUser } from '../../common/decorators/current-user';
import { ZodPipe } from '../../common/pipes/zod.pipe';
import type { SessionUser } from '@beauty/types';
import { BookingsService } from './bookings.service';
import { z } from 'zod';

@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Roles('CUSTOMER')
  @Post()
  create(
    @CurrentUser() user: SessionUser,
    @Body(new ZodPipe(bookingCreateSchema)) body: z.infer<typeof bookingCreateSchema>,
  ) {
    return this.bookings.create(user, body);
  }

  @Get()
  list(
    @CurrentUser() user: SessionUser,
    @Query(new ZodPipe(paginationQuerySchema)) query: z.infer<typeof paginationQuerySchema>,
  ) {
    return this.bookings.listForUser(user, query.cursor, query.limit);
  }

  @Get(':id')
  get(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.bookings.get(user, id);
  }

  @Patch(':id/status')
  updateStatus(
    @CurrentUser() user: SessionUser,
    @Param('id') id: string,
    @Body(new ZodPipe(bookingStatusUpdateSchema)) body: z.infer<typeof bookingStatusUpdateSchema>,
  ) {
    return this.bookings.updateStatus(user, id, body.status);
  }
}
