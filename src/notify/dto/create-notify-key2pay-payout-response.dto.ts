import {
  IsString,
  IsNumber,
  IsObject,
  ValidateNested,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionStatus } from 'src/transactions/enums/transaction-status';

class BeneficiaryDto {
  @IsString()
  account: string;

  @IsOptional()
  @IsString()
  accountDigit?: string;

  @IsString()
  accountType: string;

  @IsString()
  bankCode: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  documentNumber: string;

  @IsString()
  documentType: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  region?: string;
}

export class CreateNotifyKey2payPayoutResponseDTO {
  @IsString()
  uid: string;

  @IsEnum(TransactionStatus)
  status: TransactionStatus;

  @IsString()
  method: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsString()
  description: string;

  @IsString()
  currency: string;

  @IsNumber()
  amount: number;

  @IsString()
  referenceCode: string;

  @IsString()
  notificationUrl: string;

  @IsObject()
  @ValidateNested()
  @Type(() => BeneficiaryDto)
  beneficiary: BeneficiaryDto;
}
