import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { serviceCreateSchema } from '@beauty/validation';
import { Public } from '../../common/decorators/public';
import { Roles } from '../../common/decorators/roles';
import { CurrentUser } from '../../common/decorators/current-user';
import { ZodPipe } from '../../common/pipes/zod.pipe';
import type { SessionUser } from '@beauty/types';
import { ServicesService } from './services.service';
import { z } from 'zod';

@Controller('api/professionals/:id/services')
export class ServicesController {
  constructor(private readonly services: ServicesService) {}

  @Public()
  @Get()
  list(@Param('id') professionalId: string) {
    return this.services.listPublic(professionalId);
  }

  @Roles('PROFESSIONAL', 'ADMIN')
  @Post()
  create(
    @CurrentUser() user: SessionUser,
    @Param('id') professionalId: string,
    @Body(new ZodPipe(serviceCreateSchema)) body: z.infer<typeof serviceCreateSchema>,
  ) {
    return this.services.create(user, professionalId, body);
  }

  @Roles('PROFESSIONAL', 'ADMIN')
  @Patch(':serviceId')
  update(
    @CurrentUser() user: SessionUser,
    @Param('id') professionalId: string,
    @Param('serviceId') serviceId: string,
    @Body() body: Partial<z.infer<typeof serviceCreateSchema>> & { isActive?: boolean },
  ) {
    return this.services.update(user, professionalId, serviceId, body);
  }
}
