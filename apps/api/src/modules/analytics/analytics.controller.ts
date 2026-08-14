import { Controller, Get } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles';
import { CurrentUser } from '../../common/decorators/current-user';
import type { SessionUser } from '@beauty/types';
import { AnalyticsService } from './analytics.service';
import { Errors } from '../../common/errors';

@Controller()
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Roles('ADMIN')
  @Get('api/admin/analytics')
  dashboard() {
    return this.analytics.dashboard();
  }

  @Roles('PROFESSIONAL')
  @Get('api/professional/overview')
  overview(@CurrentUser() user: SessionUser) {
    if (!user.professionalProfileId) throw Errors.forbidden();
    return this.analytics.professionalOverview(user.professionalProfileId);
  }
}
