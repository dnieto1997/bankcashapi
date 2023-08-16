import { Module } from '@nestjs/common';
import { DigitalCardService } from './digital-card.service';
import { DigitalCardController } from './digital-card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DigitalCard } from './entities/digital-card.entity';

@Module({
  controllers: [DigitalCardController],
  providers: [DigitalCardService],
  imports: [TypeOrmModule.forFeature([DigitalCard])],
})
export class DigitalCardModule {}
