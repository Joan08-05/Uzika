import { Controller, Get, Post, Patch, Param, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { PermissionGuard } from '../guard/permission.guard';
import { RequirePermission } from '../decorators/require-permission.decorator';
import { ComplaintsService } from '../services/complaints.service';
import { CreateComplaintDto } from '../dto/complaints/create-complaint.dto';

@Controller('complaints')
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermission('orders')
export class ComplaintsController {
  constructor(private complaintsService: ComplaintsService) {}

  @Get()
  findAll() {
    return this.complaintsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateComplaintDto) {
    return this.complaintsService.create(dto);
  }

  @Patch(':id/resolve')
  resolve(@Param('id') id: string, @Req() req: any) {
    return this.complaintsService.resolve(+id, req.user);
  }

  @Patch(':id/ignore')
  ignore(@Param('id') id: string, @Req() req: any) {
    return this.complaintsService.ignore(+id, req.user);
  }

  @Patch(':id/reconsider')
  reconsider(@Param('id') id: string) {
    return this.complaintsService.reconsider(+id);
 }
}