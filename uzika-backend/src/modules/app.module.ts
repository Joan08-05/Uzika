import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { Vendor } from '../database/entities/vendor.entity';
import { AdminUser } from '../database/entities/admin-user.entity';
import { Customer } from '../database/entities/customer.entity';
import { Complaint } from '../database/entities/complaint.entity';
import { AuthModule } from './auth.module';
import { VendorsModule } from './vendors.module';
import { CustomersModule } from './customers.module';
import { Order } from '../database/entities/order.entity';
import { OrdersModule } from './orders.module';
import { ComplaintsModule } from './complaints.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: +config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [Vendor, AdminUser, Customer, Order, Complaint],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    VendorsModule,
    CustomersModule,
    OrdersModule,
    ComplaintsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}