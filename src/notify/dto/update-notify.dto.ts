import { PartialType } from '@nestjs/swagger';
import { CreateKey2payNotifyDto } from './create-notify.dto';

export class UpdateNotifyDto extends PartialType(CreateKey2payNotifyDto) {}
