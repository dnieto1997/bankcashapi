import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateToppayPaying {
  @IsString()
  currency: string;
  @IsString()
  country: string;
  @IsString()
  amount: string;
  @IsNumber()
  targetAccount: number;
  @IsOptional()
  @MinLength(1)
  @IsString()
  description?: string;
}
