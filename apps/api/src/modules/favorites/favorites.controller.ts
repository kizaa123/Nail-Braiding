import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { favoriteCreateSchema } from '@beauty/validation';
import { Roles } from '../../common/decorators/roles';
import { CurrentUser } from '../../common/decorators/current-user';
import { ZodPipe } from '../../common/pipes/zod.pipe';
import type { SessionUser } from '@beauty/types';
import { FavoritesService } from './favorites.service';
import { z } from 'zod';

@Controller('api/favorites')
@Roles('CUSTOMER')
export class FavoritesController {
  constructor(private readonly favorites: FavoritesService) {}

  @Get()
  list(@CurrentUser() user: SessionUser) {
    return this.favorites.list(user);
  }

  @Post()
  add(
    @CurrentUser() user: SessionUser,
    @Body(new ZodPipe(favoriteCreateSchema)) body: z.infer<typeof favoriteCreateSchema>,
  ) {
    return this.favorites.add(user, body);
  }

  @Delete(':id')
  remove(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.favorites.remove(user, id);
  }
}
