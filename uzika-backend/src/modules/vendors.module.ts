import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Vendor } from '../database/entities/vendor.entity';
import { Order } from '../database/entities/order.entity';
import { AdminUser } from '../database/entities/admin-user.entity';
import { SettlementRecord } from '../database/entities/settlement-record.entity';
import { VendorsController } from '../controllers/vendors.controller';
import { VendorsService } from '../services/vendors.service';
import { PermissionGuard } from '../guard/permission.guard';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vendor, Order, AdminUser, SettlementRecord]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [VendorsController],
  providers: [VendorsService, PermissionGuard, JwtStrategy],
})
export class VendorsModule {}