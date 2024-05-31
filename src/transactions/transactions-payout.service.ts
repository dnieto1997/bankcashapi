import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

// import { v4 as uuidv4 } from 'uuid';
import { customAlphabet } from 'nanoid';

import { User } from 'src/users/entities/user.entity';
import {
  TypeTransactionEnum,
  TypeTransactionTopPay,
} from './enums/type-transaction.enum';
import { ToppayService } from '../common/services/toppay.service';
import { Currency } from './enums/currency-code.enum';
import { Key2payAuthService } from '../common/services/key2pay-auth.service';
import { TransactionStatus } from './enums/transaction-status';
import { CountryService } from 'src/country/country.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { ConfigService } from '@nestjs/config';
import { CreatePayout } from './dto/create-payout.dto';
import { Ikey2PayPayoutBody } from 'src/common/interfaces/key2pay-payout-body.interface';
import { TypeTransaction } from './entities/type-transaction.entity';
import { Taxes } from './entities/taxes.entity';
import { calculateTax } from './helpers/calculate-tax.helper';

enum CountryEnum {
  CO = 'CO',
  PE = 'PE',
  BR = 'BR',
}
const alphabet =
  'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890';

const nanoid = customAlphabet(alphabet);

@Injectable()
export class TransactionsPayoutService {
  private readonly logger = new Logger(TransactionsPayoutService.name);
  private readonly apiUrl: string = this.configService.get<string>('API_URL');
  private readonly key2payIp: string =
    this.configService.get<string>('KEY2PAY_IP');

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(TypeTransaction)
    private readonly typeTransactionRepository: Repository<TypeTransaction>,

    private readonly key2payAuthService: Key2payAuthService,
    private readonly toppayService: ToppayService,
    private readonly countryService: CountryService,
    private readonly configService: ConfigService,
  ) {}

  async createPayout(createPayout: CreatePayout, user: User) {
    if (
      [CountryEnum.CO, CountryEnum.PE].includes(
        createPayout.country as CountryEnum,
      ) &&
      createPayout.currency !== Currency.USD
    ) {
      // if (createPayout.country == CountryEnum.CO) {
      //   createPayout.currency = 'COL';
      // }

      if (createPayout.country == CountryEnum.PE) {
        createPayout.currency = 'SOL';
      }

      // console.log({ createPayoutTop: createPayout });

      return await this.createToppayPayout(createPayout, user);
    }

    // console.log({ createPayoutK: createPayout });

    return await this.createPayoutKey2pay(createPayout, user);
  }

  async createToppayPayout(createToppayPayout: CreatePayout, userAdmin: User) {
    const { checkout, reference, currencyToGetValue } =
      await this.sendToppayPayout(createToppayPayout);

    const typeTransactionTax = await this.typeTransactionRepository.find({
      where: {
        idTypeTransaction: Equal(TypeTransactionEnum.TAX),
      },
    });

    const { conversionRate, conversionResult } =
      await this.countryService.getCurrencyValue({
        currencyCode: currencyToGetValue,
        amount: String(createToppayPayout.amount),
      });

    const taxes: Partial<Taxes>[] = [];

    for (const typeT of typeTransactionTax) {
      taxes.push({
        percentage: typeT.percentage,
        taxAmount: calculateTax(
          typeT.percentage,
          String(createToppayPayout.amount),
        ),
        taxAmountInUSD: calculateTax(typeT.percentage, conversionResult),
        taxType: typeT,
      });
    }

    const transaction = this.transactionRepository.create([
      {
        cashOutRequests: {
          idCashOutRequests: createToppayPayout.idCashOutRequests,
        },
        countryCode: createToppayPayout.country,
        sourceAccount: userAdmin.account,
        amount: String(createToppayPayout.amount),
        description: createToppayPayout?.comments,
        reference,
        conversionRate,
        conversionResult,
        transactionCurrencyCode: currencyToGetValue,
        typeTransaction: {
          idTypeTransaction: TypeTransactionEnum.PAYOUT,
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

  async sendToppayPayout(createToppayPayout: CreatePayout) {
    const today = new Date();
    const currentmoth = today.getMonth();
    today.setMonth(currentmoth + 6);
    const isoString = today.toISOString();
    const reference = nanoid();

    const body = {
      reference,
      amount: String(createToppayPayout.amount),
      currency: createToppayPayout.currency,
      numdoc: String(createToppayPayout.document),
      username: `${createToppayPayout.firstName} ${createToppayPayout.lastName}`,
      userphone: createToppayPayout.phone,
      usernumaccount: createToppayPayout.account,
      useremail: createToppayPayout.email,
      typetransaction: TypeTransactionTopPay.PAYOUT,
      userbank: '',
      usertypeaccount: '',
      expiration: isoString.slice(0, 10),
      method: 'TUP_OUT',
    };
    let checkout: string = '';
    let currencyToGetValue: string = '';
    if (createToppayPayout.country === CountryEnum.CO) {
      const { data } = await this.toppayService.sendPayColombia(body);

      checkout = data.data.checkout;
      currencyToGetValue = 'COP';
    }

    if (createToppayPayout.country === CountryEnum.PE) {
      const { data } = await this.toppayService.sendPayPeru(body);

      checkout = data.data.checkout;
      currencyToGetValue = 'PEN';
    }

    return { checkout, reference, currencyToGetValue };
  }

  async createPayoutKey2pay(
    createTransactionDto: CreatePayout,
    userAdmin: User,
  ) {
    const data = await this.sendkey2payPayoutBody(
      createTransactionDto,
      userAdmin,
      'response-key2pay-payout',
    );
    // console.log(data);

    const typeTransactionTax = await this.typeTransactionRepository.find({
      where: {
        idTypeTransaction: Equal(TypeTransactionEnum.TAX),
      },
    });

    const { conversionRate, conversionResult } =
      await this.countryService.getCurrencyValue({
        currencyCode: data.currency,
        amount: String(data.amount),
      });

    const taxes: Partial<Taxes>[] = [];

    for (const typeT of typeTransactionTax) {
      taxes.push({
        percentage: typeT.percentage,
        taxAmount: calculateTax(
          typeT.percentage,
          String(createTransactionDto.amount),
        ),
        taxAmountInUSD: calculateTax(typeT.percentage, conversionResult),
        taxType: typeT,
      });
    }

    try {
      const transaction = this.transactionRepository.create([
        {
          cashOutRequests: {
            idCashOutRequests: createTransactionDto.idCashOutRequests,
          },
          sourceAccount: userAdmin.account,
          amount: String(data.amount),
          reference: data.referenceCode,
          countryCode: createTransactionDto.country,
          description: createTransactionDto?.comments,
          conversionRate,
          conversionResult,
          transactionCurrencyCode: data.currency,
          typeTransaction: {
            idTypeTransaction: TypeTransactionEnum.PAYOUT,
          },
          taxes,
          transactionStatus: TransactionStatus.PENDING,
        },
      ]);

      await this.transactionRepository.save(transaction);

      return { message: data.message, status: data.status };
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async sendkey2payPayoutBody(
    createTransactionDto: CreatePayout,
    user: User,
    uri: string,
  ) {
    const payoutBody: Ikey2PayPayoutBody = {
      method: createTransactionDto.method, //1
      currency: createTransactionDto.currency, //2
      amount: Number(createTransactionDto.amount + '00'), //3
      referenceCode: nanoid(),
      description: createTransactionDto.description || 'default description', //4
      notificationUrl: `${this.apiUrl}/notify/${uri}`,
      beneficiary: {
        firstName: createTransactionDto.firstName, //5
        lastName: createTransactionDto.lastName, //6
        documentNumber: createTransactionDto.document, //7
        email: createTransactionDto.email, //8
        country: createTransactionDto.country, //9
        phone: createTransactionDto.phone, //10
        accountType: createTransactionDto.accountType, //11
        account: createTransactionDto.account, //12
        documentType: createTransactionDto.documentType, //13
      },
    };

    if (
      createTransactionDto.country == CountryEnum.BR &&
      createTransactionDto.method == 'bank-transfer-br'
    ) {
      payoutBody.beneficiary.branch = createTransactionDto.branch; //14
      payoutBody.beneficiary.accountDigit =
        createTransactionDto.accountDigit || '4'; //15
    }
    if (createTransactionDto.method != 'pix') {
      payoutBody.beneficiary.bankCode = createTransactionDto.bankCode; //16
    }

    if (createTransactionDto.country == CountryEnum.PE) {
      payoutBody.beneficiary.region = createTransactionDto.region; //17
    }

    console.log({ boydKey2pay: createTransactionDto });

    try {
      const data = await this.key2payAuthService.sendKey2payoutBody(payoutBody);
      // console.log('Paso');
      return data;
    } catch (error) {
      // console.log(error.response);
      throw new BadRequestException(error.response.data);
    }
  }

  private handleDbErrors(error: any) {
    this.logger.error(error);

    throw new InternalServerErrorException('Check server logs');
  }
}
