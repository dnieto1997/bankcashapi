import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { TypeTransactionEnum } from '../enums/type-transaction.enum';

export class CreateTransactionDto {
  @IsEnum(TypeTransactionEnum)
  typeTransaction: TypeTransactionEnum;

  @IsString()
  @Matches(/^[+1-9]{1}[+0-9]*$/)
  amount: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  targetAccount?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  transactionCurrencyCode?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  exchangeValue?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  description?: string;
}
