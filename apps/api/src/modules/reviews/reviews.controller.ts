import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { paginationQuerySchema, reviewCreateSchema } from '@beauty/validation';
import { Public } from '../../common/decorators/public';
import { Roles } from '../../common/decorators/roles';
import { CurrentUser } from '../../common/decorators/current-user';
import { ZodPipe } from '../../common/pipes/zod.pipe';
import type { SessionUser } from '@beauty/types';
import { ReviewsService } from './reviews.service';
import { z } from 'zod';

@Controller()
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  @Roles('CUSTOMER')
  @Post('api/reviews')
  create(
    @CurrentUser() user: SessionUser,
    @Body(new ZodPipe(reviewCreateSchema)) body: z.infer<typeof reviewCreateSchema>,
  ) {
    return this.reviews.create(user, body);
  }

  @Public()
  @Get('api/professionals/:id/reviews')
  list(
    @Param('id') professionalId: string,
    @Query(new ZodPipe(paginationQuerySchema)) query: z.infer<typeof paginationQuerySchema>,
  ) {
    return this.reviews.listForProfessional(professionalId, query.cursor, query.limit);
  }

  @Roles('ADMIN')
  @Patch('api/admin/reviews/:id')
  moderate(
    @Param('id') id: string,
    @Body() body: { status: 'APPROVED' | 'REJECTED' },
  ) {
    return this.reviews.moderate(id, body.status);
  }
}
