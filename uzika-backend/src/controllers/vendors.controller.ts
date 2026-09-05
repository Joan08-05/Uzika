import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { PermissionGuard } from '../guard/permission.guard';
import { RequirePermission } from '../decorators/require-permission.decorator';
import { VendorsService } from '../services/vendors.service';
import { UpdateVendorStatusDto } from '../dto/vendors/update-vendor-status.dto';

@Controller('vendors')
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermission('vendors')
export class VendorsController {
  constructor(private vendorsService: VendorsService) {}

  @Get()
  findAll(@Query('status') status?: string) {
    return this.vendorsService.findAll(status as any);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateVendorStatusDto) {
    return this.vendorsService.updateStatus(+id, dto.status, dto.reason);
  }

  @Patch(':id/settle')
  markSettled(@Param('id') id: string) {
    return this.vendorsService.markSettled(+id);
  }

  @Patch(':id/toggle-open')
  toggleOpen(@Param('id') id: string) {
    return this.vendorsService.toggleOpen(+id);
  }
}