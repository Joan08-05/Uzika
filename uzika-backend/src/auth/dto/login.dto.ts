import { IsEmail, Matches, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'Email must include a valid domain (e.g. name@example.com)',
  })
  email: string;

  @IsString()
  password: string;
}