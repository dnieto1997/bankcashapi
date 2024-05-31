import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { TransactionStatus } from 'src/transactions/enums/transaction-status';

// Definimos una clase para el customer
class CustomerDto {
  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phone: string;

  @IsString()
  postcode: string;

  @IsString()
  personalId: string;

  @IsString()
  ip: string;
}

// Definimos una clase para el objeto principal
export class CreateKey2payNotifyDto {
  @IsString()
  uid: string;

  @IsEnum(TransactionStatus)
  status: TransactionStatus;

  @IsString()
  message: string;

  @IsString()
  creationDate: string;

  @IsString()
  notificationDate: string;

  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsString()
  currency: string;

  @IsString()
  language: string;

  @IsString()
  orderId: string;

  @IsObject()
  @ValidateNested()
  @Type(() => CustomerDto) // agregamos este decorador
  customer: CustomerDto;
}
