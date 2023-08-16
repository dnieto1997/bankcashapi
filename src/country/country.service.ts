import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Repository } from 'typeorm';
import { Country } from './entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CountryService {
  private logger = new Logger(CountryService.name);

  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  create(createCountryDto: CreateCountryDto) {
    return 'This action adds a new country';
  }

  findAll() {
    return `This action returns all country`;
  }

  async findOne(id: number) {
    try {
      const country = await this.countryRepository.findOneBy({ idCountry: id });

      if (!country) {
        throw new BadRequestException();
      }
      return country;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  update(id: number, updateCountryDto: UpdateCountryDto) {
    return `This action updates a #${id} country`;
  }

  remove(id: number) {
    return `This action removes a #${id} country`;
  }

  private handleDbErrors(error: any) {
    if (error.status == 400) {
      throw new BadRequestException();
    }
    this.logger.error(error);
  }
}
