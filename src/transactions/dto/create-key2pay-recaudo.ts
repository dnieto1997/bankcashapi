import { IsNumber } from 'class-validator';
import { CreateKey2Pay } from './create-key2pay-pay.dto';

export class CreateKey2payCollection extends CreateKey2Pay {
  @IsNumber()
  targetAccount: number;
}
