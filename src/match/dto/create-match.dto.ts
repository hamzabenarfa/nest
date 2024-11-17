import { IsDate, IsNotEmpty, IsString } from '@nestjs/class-validator';
import { Type } from 'class-transformer';

export class CreateMatchDto {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsString()
  longitude: string;

  @IsNotEmpty()
  @IsString()
  latitude: string;
}
