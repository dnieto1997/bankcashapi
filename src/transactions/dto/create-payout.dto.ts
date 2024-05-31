import { PartialType } from '@nestjs/swagger';
import { CreateKey2Pay } from './create-key2pay-pay.dto';
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePayout extends PartialType(CreateKey2Pay) {
  @IsOptional()
  @IsString()
  @MinLength(1)
  method?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  document?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  documentType?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  bankCode?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  accountType?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  region?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  branch?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  accountDigit?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  account?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  description?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  comments?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  commentOfAdmin?: string;

  @IsNumber()
  idCashOutRequests: number;
}
