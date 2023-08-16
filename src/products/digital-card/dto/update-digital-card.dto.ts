import { PartialType } from '@nestjs/mapped-types';
import { CreateDigitalCardDto } from './create-digital-card.dto';

export class UpdateDigitalCardDto extends PartialType(CreateDigitalCardDto) {}
