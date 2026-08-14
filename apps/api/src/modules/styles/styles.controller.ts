import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { paginationQuerySchema, styleCreateSchema } from '@beauty/validation';
import { Public } from '../../common/decorators/public';
import { Roles } from '../../common/decorators/roles';
import { ZodPipe } from '../../common/pipes/zod.pipe';
import { StylesService } from './styles.service';
import { z } from 'zod';

const listSchema = paginationQuerySchema.extend({
  kind: z.enum(['HAIR', 'NAILS']).optional(),
  categoryId: z.string().uuid().optional(),
});

@Controller('api/styles')
export class StylesController {
  constructor(private readonly styles: StylesService) {}

  @Public()
  @Get()
  list(@Query(new ZodPipe(listSchema)) query: z.infer<typeof listSchema>) {
    return this.styles.list(query);
  }

  @Public()
  @Get(':slug')
  bySlug(@Param('slug') slug: string) {
    return this.styles.bySlug(slug);
  }

  @Roles('ADMIN')
  @Post()
  create(@Body(new ZodPipe(styleCreateSchema)) body: z.infer<typeof styleCreateSchema>) {
    return this.styles.create(body);
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: Partial<{ name: string; description: string; isActive: boolean; imageUrl: string }>,
  ) {
    return this.styles.update(id, body);
  }
}
