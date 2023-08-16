import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DigitalCardService } from './digital-card.service';
import { CreateDigitalCardDto } from './dto/create-digital-card.dto';
import { UpdateDigitalCardDto } from './dto/update-digital-card.dto';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('digital-card')
export class DigitalCardController {
  constructor(private readonly digitalCardService: DigitalCardService) {}

  @Post()
  create(@Body() createDigitalCardDto: CreateDigitalCardDto) {
    return this.digitalCardService.create(createDigitalCardDto);
  }

  @Get()
  findAll() {
    return this.digitalCardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.digitalCardService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDigitalCardDto: UpdateDigitalCardDto,
  ) {
    return this.digitalCardService.update(+id, updateDigitalCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.digitalCardService.remove(+id);
  }
}
