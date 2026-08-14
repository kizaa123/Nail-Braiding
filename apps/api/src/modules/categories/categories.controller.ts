import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { categoryCreateSchema } from '@beauty/validation';
import { Public } from '../../common/decorators/public';
import { Roles } from '../../common/decorators/roles';
import { ZodPipe } from '../../common/pipes/zod.pipe';
import { CategoriesService } from './categories.service';
import { z } from 'zod';

const updateSchema = categoryCreateSchema.partial().extend({
  isActive: z.boolean().optional(),
});

@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Public()
  @Get()
  list(@Query('kind') kind?: 'HAIR' | 'NAILS') {
    return this.categories.list(kind);
  }

  @Roles('ADMIN')
  @Post()
  create(@Body(new ZodPipe(categoryCreateSchema)) body: z.infer<typeof categoryCreateSchema>) {
    return this.categories.create(body);
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodPipe(updateSchema)) body: z.infer<typeof updateSchema>,
  ) {
    return this.categories.update(id, body);
  }
}
