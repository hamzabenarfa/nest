import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from '@nestjs/class-validator';
import { IsOptional, Max, Min } from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class SignupDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @Min(8)
  @Max(8)
  phone?: string;

  @IsString()
  @IsEnum(Role)
  role: Role;
}
