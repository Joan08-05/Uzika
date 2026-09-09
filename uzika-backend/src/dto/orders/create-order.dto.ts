import { IsInt, IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  vendorId: number;

  @IsInt()
  customerId: number;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  items: string;

  @IsString()
  @IsNotEmpty()
  payment: string;
}