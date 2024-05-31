import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { UserStatus } from 'src/users/enums';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  names: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  surnames: string;

  @ApiProperty()
  @IsString()
  numDocument: number;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  password: string;

  @ApiProperty()
  @IsString()
  cellphone: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  country: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  typeDocument: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  idUserRole?: number;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
