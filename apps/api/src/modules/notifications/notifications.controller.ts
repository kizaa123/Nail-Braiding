import { Controller, Get, Param, Patch } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user';
import type { SessionUser } from '@beauty/types';
import { NotificationsService } from './notifications.service';

@Controller('api/notifications')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  list(@CurrentUser() user: SessionUser) {
    return this.notifications.listForUser(user.id);
  }

  @Patch(':id/read')
  markRead(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.notifications.markRead(user.id, id);
  }
}
