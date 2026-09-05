import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUser } from '../database/entities/admin-user.entity';
import { PERMISSION_KEY } from '../decorators/require-permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(AdminUser) private adminRepo: Repository<AdminUser>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.get<string>(PERMISSION_KEY, context.getHandler());
    if (!required) return true;

    const request = context.switchToHttp().getRequest();
    const reqUser = request.user;
    if (!reqUser) throw new ForbiddenException('Not authenticated');

    if (reqUser.role === 'SuperAdmin') return true;

    const user = await this.adminRepo.findOne({ where: { id: reqUser.userId } });
    if (!user || !user.permissions?.[required]) {
      throw new ForbiddenException(`You don't have permission to access ${required}.`);
    }
    return true;
  }
}