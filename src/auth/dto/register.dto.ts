import { IsEmail, IsString, MinLength, IsOptional, IsDateString, IsIn } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsIn(['client', 'artist', 'admin'])
  role?: string;

  @IsOptional()
  @IsString()
  profileImageUrl?: string;
}
