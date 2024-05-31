import { IsEnum, IsString, Validate } from 'class-validator';
import { ToppayNotifyStatus } from '../enums/toppay-notify-status.enum';
import { Transform } from 'class-transformer';

export class CreateNotifyTopppay {
  @IsString()
  method: string;

  @IsString()
  reference: string;

  @IsEnum(ToppayNotifyStatus)
  status: ToppayNotifyStatus;

  @IsString()
  amount: string;

  @IsString()
  currency: string;

  @Transform(({ value }) => new Date(value)) // Transforma el valor en una instancia de Date
  @Validate((value: any) => {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      return false; // No es una instancia de Date vÃ¡lida
    }
    return true;
  })
  update_at: Date;

  @IsString()
  referenceid: string;
}
