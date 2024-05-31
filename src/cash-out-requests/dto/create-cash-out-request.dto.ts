import { IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class CreateCashOutRequestDto {
  @IsString()
  countryCode: string;
  @IsString()
  @MinLength(2)
  currencyCode: string;
  // @IsNumber()
  // @IsPositive()
  // @Min(1)
  // amount: number;
  @IsString()
  @Matches(/^[1-9][0-9]*$/gm)
  requestedAmount: string;

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
}
