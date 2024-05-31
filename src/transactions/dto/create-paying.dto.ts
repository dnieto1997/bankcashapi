import { IsString } from 'class-validator';
import { CreateKey2Pay } from './create-key2pay-pay.dto';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePay extends PartialType(CreateKey2Pay) {
  @IsString()
  country: string;
}
