import { IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { CashOutRequestsStatus } from '../enums/cash-out-requestes-status.enum';
import { PartialType } from '@nestjs/swagger';
import { CreateCashOutRequestDto } from './create-cash-out-request.dto';

export class UpdateCashOutRequestDto extends PartialType(
  CreateCashOutRequestDto,
) {
  @IsString()
  @MinLength(1)
  @IsOptional()
  commentOfAdmin?: string;

  @IsEnum(CashOutRequestsStatus)
  statusApplication: CashOutRequestsStatus;
}
