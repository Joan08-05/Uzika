import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { PermissionGuard } from '../guard/permission.guard';
import { RequirePermission } from '../decorators/require-permission.decorator';
import { CustomersService } from '../services/customers.service';
import { UpdateCustomerStatusDto } from '../dto/customers/update-customer-status.dto';

@Controller('customers')
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermission('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateCustomerStatusDto) {
    return this.customersService.updateStatus(+id, dto.status);
  }

  @Patch(':id/refund')
  markRefunded(@Param('id') id: string) {
    return this.customersService.markRefunded(+id);
  }
}