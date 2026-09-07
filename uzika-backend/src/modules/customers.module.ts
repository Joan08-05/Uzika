import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Customer } from '../database/entities/customer.entity';
import { AdminUser } from '../database/entities/admin-user.entity';
import { CustomersController } from '../controllers/customers.controller';
import { CustomersService } from '../services/customers.service';
import { PermissionGuard } from '../guard/permission.guard';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, AdminUser]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [CustomersController],
  providers: [CustomersService, PermissionGuard, JwtStrategy],
})
export class CustomersModule {}