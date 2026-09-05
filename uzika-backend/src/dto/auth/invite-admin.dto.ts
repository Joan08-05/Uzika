import { IsEmail, IsString, MaxLength, IsOptional, IsObject } from 'class-validator';

export class InviteAdminDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsObject()
  permissions?: Record<string, boolean>;
}