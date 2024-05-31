import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateCashOutRequestDto } from './dto/create-cash-out-request.dto';
import { UpdateCashOutRequestDto } from './dto/update-cash-out-request.dto';
import { User } from 'src/users/entities/user.entity';
import { Equal, Repository } from 'typeorm';
import { CashOutRequests } from './entities/cash-out-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CashOutRequestsStatus } from './enums/cash-out-requestes-status.enum';
import { checkCurrencyByCountry } from 'src/common/helpers/check-currency-by-country.helper';
import { Key2payAuthService } from 'src/common/services/key2pay-auth.service';
import { TransactionsPayoutService } from 'src/transactions/transactions-payout.service';
import { CountryService } from 'src/country/country.service';
import { format } from 'date-fns';

@Injectable()
export class CashOutRequestsService {
  private readonly logger = new Logger(CashOutRequests.name);

  constructor(
    private readonly transactionsPayoutService: TransactionsPayoutService,
    private readonly key2payAuthService: Key2payAuthService,
    private readonly countryService: CountryService,

    @InjectRepository(CashOutRequests)
    private readonly cashOutRequestRepository: Repository<CashOutRequests>,
  ) {}

  async create(cashOutRequestsDto: CreateCashOutRequestDto, user: User) {
    const balance = user.account.balance;
    const countries = await this.key2payAuthService.getCountries();

    if (
      !checkCurrencyByCountry(
        countries,
        cashOutRequestsDto.currencyCode,
        cashOutRequestsDto.countryCode,
      )
    ) {
      throw new BadRequestException('Invalid Currency');
    }

    const { conversionResult } = await this.countryService.getCurrencyValue({
      currencyCode: cashOutRequestsDto.currencyCode,
      amount: cashOutRequestsDto.requestedAmount,
    });

    // console.log({ balance, conversionResult });

    if (Number(balance) < Number(conversionResult)) {
      throw new BadRequestException('insufficient funds');
    }

    try {
      const cashOutRequests = this.cashOutRequestRepository.create({
        ...cashOutRequestsDto,
        currencyCode: cashOutRequestsDto.currencyCode,
        comments: cashOutRequestsDto.description,
        user: user,
      });

      await this.cashOutRequestRepository.save(cashOutRequests);
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async findAll() {
    try {
      const cashOutRequestsList = await this.cashOutRequestRepository.find({
        select: {
          idCashOutRequests: true,
          requestedAmount: true,
          countryCode: true,
          currencyCode: true,
          commentOfAdmin: true,
          firstName: true,
          lastName: true,
          dateOfApplication: true,
          statusApplication: true,
        },
        where: {
          statusApplication: Equal(CashOutRequestsStatus.PENDING),
        },
        order: {
          idCashOutRequests: 'DESC',
        },
      });

      const formatedCashOtRequest = cashOutRequestsList.map((c) => {
        const formattedDate = format(
          c.dateOfApplication,
          'dd/MM/yyyy HH:mm:ss',
        );

        return {
          ...c,
          dateOfApplication: formattedDate,
          commentOfAdmin: c.commentOfAdmin || '',
        };
      });
      return formatedCashOtRequest;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} cashOutRequest`;
  }

  async update(id: number, updateCashOutRequestDto: UpdateCashOutRequestDto) {
    const cashOutRequest = await this.cashOutRequestRepository.findOne({
      relations: {
        user: {
          account: true,
        },
      },
      where: {
        idCashOutRequests: id,
      },
    });

    if (
      updateCashOutRequestDto.statusApplication ===
      CashOutRequestsStatus.APPROVED
    ) {
      // console.log({ cashOutRequest });
      const resp = await this.transactionsPayoutService.createPayout(
        {
          ...cashOutRequest,
          country: cashOutRequest.countryCode,
          currency: cashOutRequest.currencyCode,
          amount: Number(cashOutRequest.requestedAmount),
        },
        cashOutRequest.user,
      );
      // console.log({ resp });
      try {
        await this.cashOutRequestRepository.update(
          { idCashOutRequests: id },
          updateCashOutRequestDto,
        );
      } catch (error) {
        this.handleDbErrors(error);
      }

      return resp;
    }

    try {
      await this.cashOutRequestRepository.update(
        { idCashOutRequests: id },
        updateCashOutRequestDto,
      );
    } catch (error) {
      this.handleDbErrors(error);
    }

    return cashOutRequest;
  }

  remove(id: number) {
    return `This action removes a #${id} cashOutRequest`;
  }

  public get getStatus(): CashOutRequestsStatus[] {
    return [
      CashOutRequestsStatus.APPROVED,
      CashOutRequestsStatus.PENDING,
      CashOutRequestsStatus.REJECTED,
    ];
  }

  private handleDbErrors(error: any) {
    console.log(error);
    this.logger.error(error);

    throw new InternalServerErrorException('Check server logs');
  }
}
