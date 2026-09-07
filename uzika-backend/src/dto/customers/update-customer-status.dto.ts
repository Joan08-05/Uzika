import { IsIn } from 'class-validator';

export class UpdateCustomerStatusDto {
  @IsIn(['active', 'suspended'])
  status: 'active' | 'suspended';
}