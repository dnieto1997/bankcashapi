import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// import { Country } from './entities';
import { Key2payAuthService } from '../common/services/key2pay-auth.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Banks,
  Country,
  Currency,
  DocuemntsAllowed,
  MehtodsPayout,
  Regions,
  TypeAccountAllowed,
} from './entities';
import { In, Not, Repository } from 'typeorm';
import { IExchangerateResponse } from './interfaces/exchangerate-response.interface';
import { firstValueFrom, catchError } from 'rxjs';
import { IRESTCountryResponse as IRestCountryResponse } from './interfaces/rest-country-response.interface';

@Injectable()
export class CountryService {
  private readonly logger = new Logger(CountryService.name);
  private readonly exchangerateApiUrl: string = this.configService.get<string>(
    'EXCHANGERATE_API_URL',
  );

  constructor(
    private readonly httpService: HttpService,
    private readonly key2payAuthService: Key2payAuthService,
    private readonly configService: ConfigService,

    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,

    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,

    @InjectRepository(MehtodsPayout)
    private readonly methodsPayoutRepository: Repository<MehtodsPayout>,

    @InjectRepository(Banks)
    private readonly banksRepository: Repository<Banks>,

    @InjectRepository(Regions)
    private readonly regionsRepository: Repository<Regions>,

    @InjectRepository(DocuemntsAllowed)
    private readonly documentsAllowedRepository: Repository<DocuemntsAllowed>,

    @InjectRepository(TypeAccountAllowed)
    private readonly typeAccountRepository: Repository<TypeAccountAllowed>,
  ) {} // private readonly countryRepository: Repository<Country>, // @InjectRepository(Country)

  async getCountries() {
    const countries = await this.countryRepository.find();
    return countries;
  }

  async getCocuntriesByPayout() {
    const countries = await this.countryRepository.find({
      where: {
        countryCode: In(['CO', 'PE', 'CL', 'MX', 'BR', 'EC']),
      },
    });

    return countries;
  }

  async getMethods(idCountry: number) {
    const methods = await this.methodsPayoutRepository.find({
      where: {
        country: {
          idCountry,
        },
      },
    });
    return methods;
  }

  async getTypeAccountsByMethodId(idMethodsPayout: number) {
    const typeAccounts = await this.typeAccountRepository.find({
      where: {
        mehtodsPayout: {
          idMethodsPayout,
        },
      },
    });

    return typeAccounts;
  }

  async getRegionsByCountry(idCountry: number) {
    const regions = await this.regionsRepository.find({
      where: {
        country: {
          idCountry,
        },
      },
      select: ['name'],
    });
    return regions.map(({ name }) => ({
      name,
      code: name,
    }));
  }

  async getBanksByCountry(idCountry: number) {
    const banks = await this.banksRepository.find({
      where: {
        country: {
          idCountry,
        },
      },
    });

    return banks;
  }

  async findCountryByCountryCode(countryCode: string) {
    const country = await this.countryRepository.find({
      where: {
        countryCode,
      },
    });

    return country[0];
  }

  async getFlag(countryCode: string): Promise<IRestCountryResponse> {
    // Construye la URL de la API usando el código del país
    const url = `https://restcountries.com/v3.1/alpha/${countryCode}?fields=flags`;
    // Hace la petición HTTP usando el método get()
    const response = await firstValueFrom(
      this.httpService.get<IRestCountryResponse>(url).pipe(
        catchError((e) => {
          throw new BadRequestException(e);
        }),
      ),
    );
    // Devuelve la imagen de la bandera
    return response.data;
  }

  async updateFlags() {
    const countries = await this.countryRepository.find({
      where: {
        countryCode: Not('00'),
      },
      select: {
        idCountry: true,
        countryCode: true,
      },
    });

    for (const country of countries) {
      const countryCode = country.countryCode;

      const { flags } = await this.getFlag(countryCode);

      country.flagPng = flags.png;
      country.flagSvg = flags.svg;

      await this.countryRepository.update(country.idCountry, country);
    }

    // await this.countryRepository.save(countries);

    return countries;
  }

  async getCurrencyValue({
    currencyCode,
    amount,
  }: {
    currencyCode: string;
    amount: string;
  }) {
    try {
      const queryBuilder =
        this.currencyRepository.createQueryBuilder('currency');
      const currency = await queryBuilder
        .where('code =:currencyCode', {
          currencyCode: currencyCode,
        })
        .getOne();

      if (!currency) {
        // console.log('moneda no se obtuvo');
        const data = await this.getCurrency(currencyCode, amount);
        // console.log({ data });

        const currencyToDb = this.currencyRepository.create({
          code: data.base_code,
          exchangeValue: String(data.conversion_rate),
        });

        await this.currencyRepository.save(currencyToDb);

        return {
          conversionResult: String(data.conversion_result.toFixed(2)),
          conversionRate: String(data.conversion_rate),
        };
      }

      if (!this.isToday(currency.updatedAt)) {
        const data = await this.getCurrency(currencyCode, amount);

        await this.currencyRepository.update(currency.idCurrency, {
          exchangeValue: String(data.conversion_rate),
        });

        return {
          conversionResult: String(data.conversion_result),
          conversionRate: String(data.conversion_rate),
        };
      }

      const result = {
        conversionResult: String(
          Number(currency.exchangeValue) * Number(amount),
        ),
        conversionRate: currency.exchangeValue,
      };

      return result;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }

  async getCurrency(code: string, amount: string) {
    console.log({ code, amount });
    const { data } = await firstValueFrom(
      this.httpService
        .get<IExchangerateResponse>(
          `${this.exchangerateApiUrl}/pair/${code}/USD/${amount}`,
        )
        .pipe(
          catchError(() => {
            throw new InternalServerErrorException();
          }),
        ),
    );

    return data;
  }

  async findCurrencys(countryCode: string) {
    const countries = await this.key2payAuthService.getCountries();

    const country = countries.find(
      (country) => country.country === countryCode.toLocaleUpperCase(),
    );

    return { currencys: country.currencies };
  }
  async findDocumentsAllowed(idCountry: number) {
    const documents = await this.documentsAllowedRepository.find({
      where: {
        country: {
          idCountry,
        },
      },
    });

    return documents;
  }

  private handleDbErrors(error: any) {
    if (error.status == 400) {
      throw new BadRequestException();
    }
    console.log(error);
    this.logger.error(error);
  }
}
