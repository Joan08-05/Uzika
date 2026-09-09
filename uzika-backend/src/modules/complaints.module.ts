import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Complaint } from '../database/entities/complaint.entity';
import { Vendor } from '../database/entities/vendor.entity';
import { Customer } from '../database/entities/customer.entity';
import { AdminUser } from '../database/entities/admin-user.entity';
import { ComplaintsController } from '../controllers/complaints.controller';
import { ComplaintsService } from '../services/complaints.service';
import { PermissionGuard } from '../guard/permission.guard';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Complaint, Vendor, Customer, AdminUser]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ComplaintsController],
  providers: [ComplaintsService, PermissionGuard, JwtStrategy],
})
export class ComplaintsModule {}