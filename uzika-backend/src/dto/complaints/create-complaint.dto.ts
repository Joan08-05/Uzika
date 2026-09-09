import { IsIn, IsInt, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateComplaintDto {
  @IsIn(['vendor', 'customer'])
  fromType: 'vendor' | 'customer';

  @IsInt()
  fromId: number;

  @IsOptional()
  @IsIn(['vendor', 'customer', 'general'])
  aboutType?: 'vendor' | 'customer' | 'general';

  @IsOptional()
  @IsInt()
  aboutId?: number;

  @IsString()
  @MaxLength(500)
  issue: string;
}