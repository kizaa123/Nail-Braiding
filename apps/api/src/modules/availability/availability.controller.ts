import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { availabilitySlotSchema } from '@beauty/validation';
import { Public } from '../../common/decorators/public';
import { Roles } from '../../common/decorators/roles';
import { CurrentUser } from '../../common/decorators/current-user';
import { ZodPipe } from '../../common/pipes/zod.pipe';
import type { SessionUser } from '@beauty/types';
import { AvailabilityService } from './availability.service';
import { Errors } from '../../common/errors';
import { z } from 'zod';

const replaceSchema = z.array(availabilitySlotSchema);

@Controller('api/professionals/:id/availability')
export class AvailabilityController {
  constructor(private readonly availability: AvailabilityService) {}

  @Public()
  @Get()
  list(
    @Param('id') professionalId: string,
    @Query('date') date?: string,
    @Query('durationMinutes') durationMinutes?: string,
  ) {
    if (date) {
      return this.availability.slotsForDate(
        professionalId,
        date,
        durationMinutes ? Number(durationMinutes) : 60,
      );
    }
    return this.availability.list(professionalId);
  }

  @Roles('PROFESSIONAL', 'ADMIN')
  @Put()
  replace(
    @CurrentUser() user: SessionUser,
    @Param('id') professionalId: string,
    @Body(new ZodPipe(replaceSchema)) body: z.infer<typeof replaceSchema>,
  ) {
    if (user.role !== 'ADMIN' && user.professionalProfileId !== professionalId) {
      throw Errors.forbidden();
    }
    return this.availability.setWeekly(professionalId, body);
  }
}
