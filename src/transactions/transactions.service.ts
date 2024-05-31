import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Equal, Repository } from 'typeorm';
// import { v4 as uuidv4 } from 'uuid';
import { customAlphabet } from 'nanoid';

import { Transaction } from './entities/transaction.entity';
import { HttpService } from '@nestjs/axios';

import { User } from 'src/users/entities/user.entity';
import { CreateKey2Pay } from './dto/create-key2pay-pay.dto';
import { Key2payAuthService } from '../common/services/key2pay-auth.service';
import { IKeypayPayingBody } from './interfaces';
import {
  TypeTransactionEnum,
  TypeTransactionTopPay,
} from './enums/type-transaction.enum';
import { TransactionStatus } from './enums/transaction-status';
import { CreateToppayPaying } from './dto/create-toppay-paying';
import { ToppayService } from 'src/common/services/toppay.service';
import { Currency } from './enums/currency-code.enum';
import { CreatePay } from './dto/create-paying.dto';
import { ConfigService } from '@nestjs/config';
import { checkCurrencyByCountry } from 'src/common/helpers/check-currency-by-country.helper';
import { CountryService } from 'src/country/country.service';
import { UserStatus } from 'src/users/enums';
import { TypeTransaction } from './entities/type-transaction.entity';
import { calculateTax } from './helpers/calculate-tax.helper';
import { Taxes } from './entities/taxes.entity';

enum CountryEnum {
  CO = 'CO',
  PE = 'PE',
}

const alphabet =
  'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890';

const nanoid = customAlphabet(alphabet);

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger();
  private readonly key2payIp: string =
    this.configService.get<string>('KEY2PAY_IP');
  private readonly apiUrl: string = this.configService.get<string>('API_URL');

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(TypeTransaction)
    private readonly typeTransactionRepository: Repository<TypeTransaction>,

    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly key2payAuthService: Key2payAuthService,
    private readonly toppayService: ToppayService,
    private readonly countryService: CountryService,
  ) {}

  async findAll(user: User) {
    const resultQuery = await this.transactionRepository.find({
      relations: {
        sourceAccount: {
          user: true,
        },
        targetAccount: {
          user: true,
        },
        cashOutRequests: true,
        typeTransaction: true,
        taxes: {
          taxType: true,
        },
      },
      select: {
        sourceAccount: {
          idAccount: true,
          numberOfAccount: true,
          user: {
            names: true,
            surnames: true,
            email: true,
            cellphone: true,
          },
        },
        targetAccount: {
          idAccount: true,
          numberOfAccount: true,
          user: {
            names: true,
            surnames: true,
            email: true,
            cellphone: true,
          },
        },
      },
      where: [
        {
          sourceAccount: {
            idAccount: user.account.idAccount,
          },
          transactionStatus: TransactionStatus.PAID,
        },
        {
          targetAccount: {
            idAccount: user.account.idAccount,
          },
          transactionStatus: TransactionStatus.PAID,
        },
      ],
    });

    if (resultQuery.length === 0) {
      return resultQuery;
    }

    const transactionsFilter = resultQuery.filter(
      (t) =>
        t.typeTransaction.idTypeTransaction ===
          TypeTransactionEnum.COLLECTION &&
        t.sourceAccount.idAccount === user.account.idAccount,
    );

    const totalSent = transactionsFilter.reduce(
      (acc, transaction) => acc + Number(transaction.conversionResult),
      0,
    );

    const result = await this.transactionWithCountryFlag(resultQuery);

    const groupedTransaction = this.groupTransactionByCreatedAt(result);

    groupedTransaction.at(0).totalSent = totalSent;

    return groupedTransaction;
  }

  async findAllOfAdmin(idUser: number) {
    const user = await this.userRepository.find({
      where: {
        role: {
          idUserRole: 2,
        },
        idUser,
        status: UserStatus.ACTIVE,
      },
      relations: {
        account: true,
      },
    });

    const resultQuery = await this.transactionRepository.find({
      relations: {
        sourceAccount: {
          user: true,
        },
        targetAccount: {
          user: true,
        },
        cashOutRequests: true,
        typeTransaction: true,
        taxes: {
          taxType: true,
        },
      },
      select: {
        sourceAccount: {
          idAccount: true,
          numberOfAccount: true,
          user: {
            names: true,
            surnames: true,
            email: true,
            cellphone: true,
          },
        },
        targetAccount: {
          idAccount: true,
          numberOfAccount: true,
          user: {
            names: true,
            surnames: true,
            email: true,
            cellphone: true,
          },
        },
      },
      where: [
        {
          sourceAccount: {
            idAccount: user[0].account.idAccount,
          },
          transactionStatus: TransactionStatus.PAID,
        },
        {
          targetAccount: {
            idAccount: user[0].account.idAccount,
          },
          transactionStatus: TransactionStatus.PAID,
        },
      ],
    });

    const result = await this.transactionWithCountryFlag(resultQuery);

    return this.groupTransactionByCreatedAt(result);
  }

  async transactionWithCountryFlag(transactions: Transaction[]) {
    const result = [];
    for (const transaction of transactions) {
      // console.log(transaction);
      const country = await this.countryService.findCountryByCountryCode(
        transaction.countryCode,
      );

      if (!country) {
        result.push(transaction);
      } else {
        result.push({
          ...transaction,
          country: {
            name: country.countryName,
            flagPng: country.flagPng,
            svg: country.flagSvg,
          },
        });
      }
    }

    return result;
  }

  groupTransactionByCreatedAt(transactions: any[]) {
    // Agrupa los datos por el campo createdAt usando un objeto auxiliar
    const grouped = {};
    for (const row of transactions) {
      const date = row.createdAt.toISOString().slice(0, 10); // Obtiene la fecha en formato YYYY-MM-DD
      if (!grouped[date]) {
        // Si no existe la propiedad fecha, la crea con un array vacío
        grouped[date] = [];
      }
      // Añade el objeto row al array correspondiente a la fecha
      grouped[date].push(row);
    }

    // Convierte el objeto auxiliar en un array de objetos con las propiedades fecha y datos
    const output = [];
    for (const date in grouped) {
      output.push({
        fecha: date,
        datos: grouped[date],
      });
    }

    // Devuelve el array de objetos como resultado de la api
    return output.reverse();
  }

  async createPaying(createPaying: CreatePay, user: User) {
    // const country = await this.countryRepository.findOne({
    //   where: {
    //     idCountry: Number(createPaying.country),
    //   },
    // });

    const countries = await this.key2payAuthService.getCountries();

    if (
      !checkCurrencyByCountry(
        countries,
        createPaying.currency,
        createPaying.country,
      )
    ) {
      throw new BadRequestException('Invalid Currency');
    }

    // if (createPaying.currency.length == 0) {
    //   throw new BadRequestException('Currency is required');
    // }

    if (
      [CountryEnum.CO, CountryEnum.PE].includes(
        createPaying.country as CountryEnum,
      ) &&
      createPaying.currency !== Currency.USD
    ) {
      const currency: Currency | string = '';
      if (createPaying.country == CountryEnum.CO) {
        createPaying.currency = 'COP';
      }

      if (createPaying.country == CountryEnum.PE) {
        createPaying.currency = 'SOL';
      }

      return await this.createToppayPaying(
        {
          ...createPaying,
          amount: String(createPaying.amount),
        } as CreateToppayPaying,
        user,
      );
    }

    return await this.createkey2payPaying(createPaying as CreateKey2Pay, user);
  }

  async createCollection(createPaying: CreatePay, user: User) {
    // const balanceUser = Number(user.account.accountBalance[0].balance);

    // if (balanceUser < createPaying.amount) {
    //   throw new BadRequestException('insufficient funds');
    // }

    // const country = await this.countryRepository.findOne({
    //   where: {
    //     idCountry: Number(createPaying.country),
    //   },
    // });

    const countries = await this.key2payAuthService.getCountries();

    console.log('@@@@@@@@@', countries);

    if (
      !checkCurrencyByCountry(
        countries,
        createPaying.currency,
        createPaying.country,
      )
    ) {
      throw new BadRequestException('Invalid Currency');
    }

    // if (createPaying.currency.length == 0) {
    //   throw new BadRequestException('Currency is required');
    // }

    if (
      [CountryEnum.CO, CountryEnum.PE].includes(
        createPaying.country as CountryEnum,
      ) &&
      createPaying.currency !== Currency.USD
    ) {
      if (createPaying.country == CountryEnum.CO) {
        createPaying.currency = 'COP';
      }

      if (createPaying.country == CountryEnum.PE) {
        createPaying.currency = 'SOL';
      }

      return await this.createToppayCollection(
        {
          ...createPaying,
          amount: String(createPaying.amount),
        } as CreateToppayPaying,
        user,
      );
    }

    return await this.createCollectionKey2pay(
      createPaying as CreateKey2Pay,
      user,
    );
  }

  async createkey2payPaying(createTransactionDto: CreateKey2Pay, user: User) {
    const data = await this.sendkey2payPayBody(
      createTransactionDto,
      user,
      'response-key2pay-paying',
    );

    try {
      const transaction = this.transactionRepository.create([
        {
          sourceAccount: user.account,
          amount: String(data.amount),
          reference: data.orderId,
          transactionCurrencyCode: data.currency,
          typeTransaction: {
            idTypeTransaction: TypeTransactionEnum.PAYING,
          },
          transactionStatus: TransactionStatus.PENDING,
        },
      ]);

      await this.transactionRepository.save(transaction);
      return { data: data.paymentFormUrl };
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async createCollectionKey2pay(
    createTransactionDto: CreateKey2Pay,
    user: User,
  ) {
    const userAdmin = await this.userRepository.findOne({
      relations: {
        account: true,
      },
      where: {
        account: {
          idAccount: createTransactionDto.targetAccount,
        },
      },
    });

    const typeTransactionTax = await this.typeTransactionRepository.find({
      where: {
        idTypeTransaction: Equal(TypeTransactionEnum.TAX),
      },
    });

    const data = await this.sendkey2payPayBody(
      createTransactionDto,
      user,
      'response-key2pay-collection',
    );

    const { conversionRate, conversionResult } =
      await this.countryService.getCurrencyValue({
        currencyCode: data.currency,
        amount: String(data.amount),
      });

    const taxes: Partial<Taxes>[] = [];

    for (const typeT of typeTransactionTax) {
      taxes.push({
        percentage: typeT.percentage,
        taxAmount: calculateTax(typeT.percentage, String(data.amount)),
        taxAmountInUSD: calculateTax(typeT.percentage, conversionResult),
        taxType: typeT,
      });
    }

    try {
      const transaction = this.transactionRepository.create([
        {
          sourceAccount: user.account,
          amount: String(data.amount),
          reference: data.orderId,
          countryCode: createTransactionDto.country,
          conversionRate,
          conversionResult,
          description: createTransactionDto?.description,
          transactionCurrencyCode: data.currency,
          targetAccount: userAdmin.account,
          typeTransaction: {
            idTypeTransaction: TypeTransactionEnum.COLLECTION,
          },
          taxes,
          transactionStatus: TransactionStatus.PENDING,
        },
      ]);

      await this.transactionRepository.save(transaction);

      return { data: data.paymentFormUrl };
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async createToppayPaying(createToppayPaying: CreateToppayPaying, user: User) {
    const { checkout, reference } = await this.sendToppayPaying(
      createToppayPaying,
      user,
    );

    const transaction = this.transactionRepository.create([
      {
        sourceAccount: user.account,
        amount: String(createToppayPaying.amount),
        reference,
        transactionCurrencyCode: createToppayPaying.currency,
        typeTransaction: {
          idTypeTransaction: TypeTransactionEnum.PAYING,
        },
        transactionStatus: TransactionStatus.PENDING,
      },
    ]);

    await this.transactionRepository.save(transaction);

    return {
      data: checkout,
    };
  }

  async createToppayCollection(
    createToppayPaying: CreateToppayPaying,
    user: User,
  ) {
    const userAdmin = await this.userRepository.findOne({
      relations: {
        account: true,
      },
      where: {
        account: {
          idAccount: createToppayPaying.targetAccount,
        },
      },
    });

    const typeTransactionTax = await this.typeTransactionRepository.find({
      where: {
        idTypeTransaction: Equal(TypeTransactionEnum.TAX),
      },
    });

    const { checkout, reference, currencyToGetValue } =
      await this.sendToppayPaying(createToppayPaying, user);

    const { conversionRate, conversionResult } =
      await this.countryService.getCurrencyValue({
        currencyCode: currencyToGetValue,
        amount: createToppayPaying.amount,
      });

    const taxes: Partial<Taxes>[] = [];

    for (const typeT of typeTransactionTax) {
      taxes.push({
        percentage: typeT.percentage,
        taxAmount: calculateTax(typeT.percentage, createToppayPaying.amount),
        taxAmountInUSD: calculateTax(typeT.percentage, conversionResult),
        taxType: typeT,
      });
    }

    const transaction = this.transactionRepository.create([
      {
        sourceAccount: user.account,
        amount: String(createToppayPaying.amount),
        countryCode: createToppayPaying.country,
        reference,
        conversionRate,
        conversionResult,
        description: createToppayPaying?.description,
        transactionCurrencyCode: currencyToGetValue,
        targetAccount: userAdmin.account,
        typeTransaction: {
          idTypeTransaction: TypeTransactionEnum.COLLECTION,
        },
        taxes,
        transactionStatus: TransactionStatus.PENDING,
      },
    ]);

    await this.transactionRepository.save(transaction);

    return {
      data: checkout,
    };
  }

  async sendToppayPaying(createToppayPaying: CreateToppayPaying, user: User) {
    const today = new Date();
    const currentmoth = today.getMonth();
    today.setMonth(currentmoth + 6);
    const isoString = today.toISOString();
    const reference = nanoid();

    const body = {
      reference,
      amount: createToppayPaying.amount,
      currency: createToppayPaying.currency,
      numdoc: String(user.numDocument),
      username: user.fullName,
      userphone: user.cellphone,
      usernumaccount: user.account.numberOfAccount,
      useremail: user.email,
      typetransaction: TypeTransactionTopPay.PAYING,
      userbank: '',
      usertypeaccount: '',
      expiration: isoString.slice(0, 10),
      method: 'TUP_GEN',
    };
    let checkout: string = '';
    let currencyToGetValue: string = '';
    if (createToppayPaying.country === CountryEnum.CO) {
      const { data } = await this.toppayService.sendPayColombia(body);

      checkout = data.data.checkout;
      currencyToGetValue = 'COP';
    }

    if (createToppayPaying.country === CountryEnum.PE) {
      const { data } = await this.toppayService.sendPayPeru(body);

      checkout = data.data.checkout;
      currencyToGetValue = 'PEN';
    }

    return { checkout, reference, currencyToGetValue };
  }

  async sendkey2payPayBody(
    createTransactionDto: CreateKey2Pay,
    user: User,
    uri: string,
  ) {
    const payingBody: IKeypayPayingBody = {
      currency: createTransactionDto.currency,
      amount: createTransactionDto.amount,
      language: createTransactionDto.language || 'es',
      orderId: nanoid(),
      description: createTransactionDto.description || '',
      notificationUrl: `${this.apiUrl}/notify/${uri}`,
      customer: {
        firstName: user.names,
        lastname: user.surnames,
        personalid: String(user.numDocument),
        email: user.email,
        country: createTransactionDto.country,
        city: createTransactionDto.city,
        postcode: createTransactionDto.postCode,
        address: createTransactionDto.address,
        phone: user.cellphone,
        ip: this.key2payIp,
      },
    };

    try {
      const data = await this.key2payAuthService.sendKey2payBody(payingBody);

      return data;
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }

  private handleDbErrors(error: any) {
    console.log(error);
    this.logger.error(error);

    throw new InternalServerErrorException('Check server logs');
  }
}
