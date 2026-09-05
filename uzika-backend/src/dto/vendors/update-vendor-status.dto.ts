import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateVendorStatusDto {
  @IsIn(['active', 'application', 'suspended', 'rejected'])
  status: 'active' | 'application' | 'suspended' | 'rejected';

  @IsOptional()
  @IsString()
  reason?: string;
}