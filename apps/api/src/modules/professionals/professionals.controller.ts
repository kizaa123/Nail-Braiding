import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { professionalProfileSchema, searchQuerySchema } from '@beauty/validation';
import { Public } from '../../common/decorators/public';
import { Roles } from '../../common/decorators/roles';
import { CurrentUser } from '../../common/decorators/current-user';
import { ZodPipe } from '../../common/pipes/zod.pipe';
import type { SessionUser } from '@beauty/types';
import { ProfessionalsService } from './professionals.service';
import { Errors } from '../../common/errors';
import { z } from 'zod';

@Controller('api/professionals')
export class ProfessionalsController {
  constructor(private readonly professionals: ProfessionalsService) {}

  @Public()
  @Get()
  search(@Query(new ZodPipe(searchQuerySchema)) query: z.infer<typeof searchQuerySchema>) {
    return this.professionals.search(query);
  }

  @Public()
  @Get(':slug')
  bySlug(@Param('slug') slug: string) {
    return this.professionals.bySlug(slug);
  }

  @Roles('PROFESSIONAL')
  @Patch('me')
  updateOwn(
    @CurrentUser() user: SessionUser,
    @Body(new ZodPipe(professionalProfileSchema.partial()))
    body: Partial<{
      businessName: string;
      biography: string;
      locationCity: string;
      locationRegion: string;
      locationCountry: string;
      phoneNumber: string;
      whatsappNumber: string;
    }>,
  ) {
    if (!user.professionalProfileId) throw Errors.forbidden();
    return this.professionals.updateOwn(user.professionalProfileId, body);
  }
}
