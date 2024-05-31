import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { Repository } from 'typeorm';
import { ContactUs } from './entities/contact-us.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ContactUsService {
  private readonly logger = new Logger(ContactUsService.name);
  constructor(
    @InjectRepository(ContactUs)
    private readonly contactUsRepository: Repository<ContactUs>,
  ) {}

  async create(createContactUsDto: CreateContactUsDto) {
    try {
      const contactUs = this.contactUsRepository.create(createContactUsDto);
      await this.contactUsRepository.save(contactUs);
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async findAll() {
    try {
      const messages = await this.contactUsRepository.find();
      return messages;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  private handleDbErrors(error: any) {
    this.logger.log(error);

    throw new InternalServerErrorException();
  }
}
