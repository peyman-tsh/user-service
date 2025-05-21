import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsDate } from 'class-validator';
import { UserRole } from '../interfaces/user.interface';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  fullName: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsDate()
  createdAt:Date
  
  @IsDate()
  updatedAt:Date
} 