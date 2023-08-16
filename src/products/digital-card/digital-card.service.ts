import { Injectable } from '@nestjs/common';
import { CreateDigitalCardDto } from './dto/create-digital-card.dto';
import { UpdateDigitalCardDto } from './dto/update-digital-card.dto';

@Injectable()
export class DigitalCardService {
  create(createDigitalCardDto: CreateDigitalCardDto) {
    return 'This action adds a new digitalCard';
  }

  findAll() {
    return `This action returns all digitalCard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} digitalCard`;
  }

  update(id: number, updateDigitalCardDto: UpdateDigitalCardDto) {
    return `This action updates a #${id} digitalCard`;
  }

  remove(id: number) {
    return `This action removes a #${id} digitalCard`;
  }
}
