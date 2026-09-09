import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { PermissionGuard } from '../guard/permission.guard';
import { RequirePermission } from '../decorators/require-permission.decorator';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dto/orders/create-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermission('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Post()
  createOrder(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }

  @Patch(':id/cancel')
  cancelOrder(@Param('id') id: string) {
    return this.ordersService.cancelOrder(id);
  }

  @Patch(':id/refund')
  issueRefund(@Param('id') id: string) {
    return this.ordersService.issueRefund(id);
  }

  @Patch(':id/accept')
  acceptOrder(@Param('id') id: string) {
    return this.ordersService.acceptOrder(id);
  }

  @Patch(':id/ready')
  markReady(@Param('id') id: string) {
    return this.ordersService.markReady(id);
  }

  @Patch(':id/complete')
  confirmHandover(@Param('id') id: string) {
    return this.ordersService.confirmHandover(id);
  }
}