import { Body, Controller, Get, Patch } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles';
import { CurrentUser } from '../../common/decorators/current-user';
import type { SessionUser } from '@beauty/types';
import { CustomersService } from './customers.service';

@Controller('api/account')
@Roles('CUSTOMER')
export class CustomersController {
  constructor(private readonly customers: CustomersService) {}

  @Get()
  me(@CurrentUser() user: SessionUser) {
    return this.customers.me(user);
  }

  @Patch()
  update(
    @CurrentUser() user: SessionUser,
    @Body() body: { firstName?: string; lastName?: string; phone?: string },
  ) {
    return this.customers.update(user, body);
  }
}
