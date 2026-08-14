import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { ProfessionalsModule } from '../professionals/professionals.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [AuditModule, ProfessionalsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
