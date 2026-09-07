import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Order } from '../database/entities/order.entity';
import { Vendor } from '../database/entities/vendor.entity';
import { Customer } from '../database/entities/customer.entity';
import { AdminUser } from '../database/entities/admin-user.entity';
import { OrdersController } from '../controllers/orders.controller';
import { OrdersService } from '../services/orders.service';
import { PermissionGuard } from '../guard/permission.guard';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Vendor, Customer, AdminUser]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, PermissionGuard, JwtStrategy],
})
export class OrdersModule {}