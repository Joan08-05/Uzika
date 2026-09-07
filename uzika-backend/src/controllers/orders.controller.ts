import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { PermissionGuard } from '../guard/permission.guard';
import { RequirePermission } from '../decorators/require-permission.decorator';
import { OrdersService } from '../services/orders.service';

@Controller('orders')
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermission('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Patch(':id/refund')
  issueRefund(@Param('id') id: string) {
    return this.ordersService.issueRefund(id);
  }
}