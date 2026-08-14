import { Controller, Get, Query } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles';
import { paginationQuerySchema } from '@beauty/validation';
import { ZodPipe } from '../../common/pipes/zod.pipe';
import { AuditService } from './audit.service';

@Controller('api/admin/audit-logs')
@Roles('ADMIN')
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  list(@Query(new ZodPipe(paginationQuerySchema)) query: { cursor?: string; limit: number }) {
    return this.audit.list(query.cursor, query.limit);
  }
}
