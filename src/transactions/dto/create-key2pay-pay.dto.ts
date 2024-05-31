import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateKey2Pay {
  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsString()
  address: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  targetAccount: number;

  @IsString()
  postCode: string;

  @IsString()
  @MinLength(2)
  currency: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  @MinLength(2)
  language?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
