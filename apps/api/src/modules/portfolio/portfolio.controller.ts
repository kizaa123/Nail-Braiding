import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { paginationQuerySchema } from '@beauty/validation';
import { Public } from '../../common/decorators/public';
import { Roles } from '../../common/decorators/roles';
import { CurrentUser } from '../../common/decorators/current-user';
import { ZodPipe } from '../../common/pipes/zod.pipe';
import type { SessionUser } from '@beauty/types';
import { PortfolioService } from './portfolio.service';
import { Errors } from '../../common/errors';
import { z } from 'zod';

@Controller()
export class PortfolioController {
  constructor(private readonly portfolio: PortfolioService) {}

  @Public()
  @Get('api/professionals/:id/portfolio')
  list(
    @Param('id') professionalId: string,
    @Query(new ZodPipe(paginationQuerySchema)) query: z.infer<typeof paginationQuerySchema>,
  ) {
    return this.portfolio.list(professionalId, query.cursor, query.limit);
  }

  @Roles('PROFESSIONAL', 'ADMIN')
  @Post('api/professionals/:id/portfolio')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5_242_880 },
      fileFilter: (_req, file, cb) => {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
          cb(Errors.validation('Only JPEG, PNG, and WebP images are allowed.'), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  upload(
    @CurrentUser() user: SessionUser,
    @Param('id') professionalId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { categoryId?: string; styleId?: string; alt?: string; caption?: string },
  ) {
    if (!file) throw Errors.validation('An image file is required.');
    return this.portfolio.upload(user, professionalId, file, {
      categoryId: body.categoryId,
      styleId: body.styleId,
      alt: body.alt || 'Portfolio image',
      caption: body.caption,
    });
  }

  @Roles('PROFESSIONAL', 'ADMIN')
  @Delete('api/portfolio/:id')
  remove(@CurrentUser() user: SessionUser, @Param('id') id: string) {
    return this.portfolio.remove(user, id);
  }

  @Roles('ADMIN')
  @Patch('api/admin/portfolio/:id')
  moderate(
    @CurrentUser() user: SessionUser,
    @Param('id') id: string,
    @Body() body: { status: 'APPROVED' | 'REJECTED' },
  ) {
    return this.portfolio.moderate(user.id, id, body.status);
  }
}
