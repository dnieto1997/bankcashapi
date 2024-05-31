import { Module } from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { ContactUsController } from './contact-us.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactUs } from './entities/contact-us.entity';

@Module({
  controllers: [ContactUsController],
  providers: [ContactUsService],
  imports: [TypeOrmModule.forFeature([ContactUs])],
})
export class ContactUsModule {}
