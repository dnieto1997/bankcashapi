import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// import { User } from 'src/users/entities/user.entity';
import { Account } from 'src/account/entities/account.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { TransactionStatus } from 'src/transactions/enums/transaction-status';
// import { AccountBalance } from 'src/account/entities/account-balance.entity';
import { CreateKey2payNotifyDto } from './dto/create-notify.dto';
import { CreateNotifyTopppay } from './dto/create-notify-toppay.dto';
import { TypeTransactionEnum } from 'src/transactions/enums/type-transaction.enum';
import { ToppayNotifyStatus } from './enums/toppay-notify-status.enum';
import { Notify } from './entities/notify.entity';
import { NotifiedBy } from './enums/notified-by.enum';
import { CountryService } from '../country/country.service';
import { CreateNotifyKey2payPayoutResponseDTO } from './dto/create-notify-key2pay-payout-response.dto';
import { Taxes } from 'src/transactions/entities/taxes.entity';
import { calculateTax } from 'src/transactions/helpers/calculate-tax.helper';

@Injectable()
export class NotifyService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    // @InjectRepository(AccountBalance)
    // private readonly accountBalanceRepository: Repository<AccountBalance>,

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    @InjectRepository(Taxes)
    private readonly taxesRepository: Repository<Taxes>,

    @InjectRepository(Notify)
    private readonly notifyRepository: Repository<Notify>,

    private readonly countryService: CountryService,
  ) {}

  async defineResponseOfToppay(createNotifyTopppay: CreateNotifyTopppay) {
    const transaction = await this.transactionRepository.findOne({
      relations: {
        sourceAccount: true,
        targetAccount: true,
        typeTransaction: true,
        taxes: {
          taxType: true,
        },
      },
      where: {
        reference: createNotifyTopppay.reference,
      },
    });

    if (
      transaction.typeTransaction.idTypeTransaction ===
      TypeTransactionEnum.PAYING
    ) {
      return await this.createResponseToppayPaying(
        createNotifyTopppay,
        transaction,
      );
    }

    if (
      transaction.typeTransaction.idTypeTransaction ===
      TypeTransactionEnum.COLLECTION
    ) {
      return await this.createResponseToppayCollection(
        createNotifyTopppay,
        transaction,
      );
    }

    if (
      transaction.typeTransaction.idTypeTransaction ===
      TypeTransactionEnum.PAYOUT
    ) {
      return await this.createResponseToppayPayout(
        createNotifyTopppay,
        transaction,
      );
    }
  }

  async createResponsekey2pay(createNotifyDto: CreateKey2payNotifyDto) {
    const transaction = await this.transactionRepository.findOne({
      relations: {
        sourceAccount: true,
      },
      where: {
        reference: createNotifyDto.orderId,
      },
    });

    if (createNotifyDto.status === TransactionStatus.PAID) {
      const sourceAccount = transaction.sourceAccount;
      sourceAccount.balance = String(
        (Number(sourceAccount.balance) + Number(transaction.amount)).toFixed(2),
      );

      await this.accountRepository.save(sourceAccount);
      await this.transactionRepository.update(transaction.idTransaction, {
        transactionStatus: TransactionStatus.PAID,
      });

      const notify = this.notifyRepository.create({
        amount: transaction.amount,
        reference: transaction.reference,
        status: TransactionStatus.PAID,
        notifiedBy: NotifiedBy.KEY2PAY,
      });

      await this.notifyRepository.save(notify);

      return;
    }

    await this.transactionRepository.update(transaction.idTransaction, {
      transactionStatus: createNotifyDto.status,
    });

    const notify = this.notifyRepository.create({
      amount: transaction.amount,
      reference: transaction.reference,
      status: createNotifyDto.status,
      notifiedBy: NotifiedBy.KEY2PAY,
    });

    await this.notifyRepository.save(notify);
  }

  async createResponsekey2Collection(createNotifyDto: CreateKey2payNotifyDto) {
    const transaction = await this.transactionRepository.findOne({
      relations: {
        targetAccount: true,
        taxes: {
          taxType: true,
        },
      },
      where: {
        reference: createNotifyDto.orderId,
      },
    });

    const accountAdmin = transaction?.targetAccount;

    const taxes = transaction.taxes;
    const isToday = this.countryService.isToday(transaction.createdAt);
    if (!isToday) {
      const { conversionResult, conversionRate } =
        await this.countryService.getCurrencyValue({
          currencyCode: transaction.transactionCurrencyCode,
          amount: transaction.amount,
        });
      transaction.conversionResult = conversionResult;
      transaction.conversionRate = conversionRate;
      for (const tax of taxes) {
        tax.taxAmount = calculateTax(
          tax.taxType.percentage,
          transaction.amount,
        );
        tax.taxAmountInUSD = calculateTax(
          tax.taxType.percentage,
          transaction.conversionResult,
        );
      }

      transaction.calculate();
    }

    if (createNotifyDto.status === TransactionStatus.PAID) {
      accountAdmin.balance = String(
        (
          Number(accountAdmin.balance) +
          Number(transaction.conversionResultAfterTax)
        ).toFixed(2),
      );

      await this.accountRepository.save([accountAdmin]);
      await this.transactionRepository.update(transaction.idTransaction, {
        transactionStatus: TransactionStatus.PAID,
      });

      const notify = this.notifyRepository.create({
        amount: transaction.amount,
        reference: transaction.reference,
        status: TransactionStatus.PAID,
        notifiedBy: NotifiedBy.KEY2PAY,
      });

      await this.notifyRepository.save(notify);

      return {
        message: 'Notification Received',
      };
    }

    await this.transactionRepository.update(transaction.idTransaction, {
      transactionStatus: createNotifyDto.status,
    });

    const notify = this.notifyRepository.create({
      amount: transaction.amount,
      reference: transaction.reference,
      status: createNotifyDto.status,
      notifiedBy: NotifiedBy.KEY2PAY,
    });

    await this.notifyRepository.save(notify);

    return {
      message: 'Notification Received',
    };
  }
  async createResponsekey2Payout(
    createNotifyDto: CreateNotifyKey2payPayoutResponseDTO,
  ) {
    const transaction = await this.transactionRepository.findOne({
      relations: {
        sourceAccount: true,
        taxes: {
          taxType: true,
        },
      },
      where: {
        reference: createNotifyDto.referenceCode,
      },
    });

    const accountAdmin = transaction.sourceAccount;

    // let exchangeResult: string = '';
    const isToday = this.countryService.isToday(transaction.createdAt);
    if (!isToday) {
      const { conversionResult, conversionRate } =
        await this.countryService.getCurrencyValue({
          currencyCode: transaction.transactionCurrencyCode,
          amount: transaction.amount,
        });
      // exchangeResult = conversionResult;
      transaction.conversionResult = conversionResult;
      transaction.conversionRate = conversionRate;
      const taxes = transaction.taxes;
      for (const tax of taxes) {
        tax.taxAmount = calculateTax(
          tax.taxType.percentage,
          transaction.amount,
        );
        tax.taxAmountInUSD = calculateTax(
          tax.taxType.percentage,
          transaction.conversionResult,
        );
      }

      transaction.calculate();
    }

    // if (isToday) {
    //   exchangeResult = String(
    //     Number(transaction.amount) * Number(transaction.conversionRate),
    //   );
    // }

    if (createNotifyDto.status === TransactionStatus.PAID) {
      accountAdmin.balance = String(
        (
          Number(accountAdmin.balance) -
          Number(transaction.conversionResultAfterTax)
        ).toFixed(2),
      );

      await this.accountRepository.save([accountAdmin]);
      await this.transactionRepository.update(transaction.idTransaction, {
        transactionStatus: TransactionStatus.PAID,
      });

      const notify = this.notifyRepository.create({
        amount: transaction.amount,
        reference: transaction.reference,
        status: TransactionStatus.PAID,
        notifiedBy: NotifiedBy.KEY2PAY,
      });

      await this.notifyRepository.save(notify);

      return {
        message: 'Notification Received',
      };
    }

    await this.transactionRepository.update(transaction.idTransaction, {
      transactionStatus: createNotifyDto.status,
    });

    const notify = this.notifyRepository.create({
      amount: transaction.amount,
      reference: transaction.reference,
      status: createNotifyDto.status,
      notifiedBy: NotifiedBy.KEY2PAY,
    });

    await this.notifyRepository.save(notify);

    return {
      message: 'Notification Received',
    };
  }

  async createResponseToppayPayout(
    createNotifyTopppay: CreateNotifyTopppay,
    transaction: Transaction,
  ) {
    const isToday = this.countryService.isToday(transaction.createdAt);
    if (!isToday) {
      const { conversionResult, conversionRate } =
        await this.countryService.getCurrencyValue({
          currencyCode: transaction.transactionCurrencyCode,
          amount: transaction.amount,
        });
      transaction.conversionResult = conversionResult;
      transaction.conversionRate = conversionRate;
      const taxes = transaction.taxes;
      for (const tax of taxes) {
        tax.taxAmount = calculateTax(
          tax.taxType.percentage,
          transaction.amount,
        );
        tax.taxAmountInUSD = calculateTax(
          tax.taxType.percentage,
          transaction.conversionResult,
        );
      }

      transaction.calculate();
    }

    if (createNotifyTopppay.status === ToppayNotifyStatus.SUCCESS) {
      const sourceAccount = transaction.sourceAccount;

      sourceAccount.balance = String(
        (
          Number(sourceAccount.balance) -
          Number(transaction.conversionResultAfterTax)
        ).toFixed(2),
      );

      await this.accountRepository.save([sourceAccount]);

      await this.transactionRepository.update(transaction.idTransaction, {
        transactionStatus: TransactionStatus.PAID,
      });

      const notify = this.notifyRepository.create({
        amount: transaction.amount,
        reference: transaction.reference,
        status: TransactionStatus.PAID,
        notifiedBy: NotifiedBy.TOPPAY,
      });

      await this.notifyRepository.save(notify);

      return {
        message: 'Notification Received',
      };
    }

    await this.transactionRepository.update(transaction.idTransaction, {
      transactionStatus:
        createNotifyTopppay.status === ToppayNotifyStatus.PENDING
          ? TransactionStatus.PENDING
          : TransactionStatus.FAILED,
    });

    const notify = this.notifyRepository.create({
      amount: transaction.amount,
      reference: transaction.reference,
      status:
        createNotifyTopppay.status === ToppayNotifyStatus.PENDING
          ? TransactionStatus.PENDING
          : TransactionStatus.FAILED,
      notifiedBy: NotifiedBy.TOPPAY,
    });

    await this.notifyRepository.save(notify);

    return {
      message: 'Notification Received',
    };
  }

  async createResponseToppayPaying(
    createNotifyTopppay: CreateNotifyTopppay,
    transaction: Transaction,
  ) {
    if (createNotifyTopppay.status === ToppayNotifyStatus.SUCCESS) {
      const sourceAccount = transaction.sourceAccount;
      sourceAccount.balance = String(
        Number(sourceAccount) + Number(transaction.amount),
      );

      await this.accountRepository.save(sourceAccount);
      await this.transactionRepository.update(transaction.idTransaction, {
        transactionStatus: TransactionStatus.PAID,
      });

      const notify = this.notifyRepository.create({
        amount: transaction.amount,
        reference: transaction.reference,
        status: TransactionStatus.PAID,
        notifiedBy: NotifiedBy.TOPPAY,
      });

      await this.notifyRepository.save(notify);

      return;
    }

    // await this.transactionRepository.update(transaction.idTransaction, {
    //   transactionStatus: createNotifyTopppay.status,
    // });
  }

  async createResponseToppayCollection(
    createNotifyTopppay: CreateNotifyTopppay,
    transaction: Transaction,
  ) {
    const targetAccount = transaction.targetAccount;

    const taxes = transaction.taxes;

    const isToday = this.countryService.isToday(transaction.createdAt);
    if (!isToday) {
      const { conversionResult, conversionRate } =
        await this.countryService.getCurrencyValue({
          currencyCode: transaction.transactionCurrencyCode,
          amount: transaction.amount,
        });
      transaction.conversionResult = conversionResult;
      transaction.conversionRate = conversionRate;
      for (const tax of taxes) {
        tax.taxAmount = calculateTax(
          tax.taxType.percentage,
          transaction.amount,
        );
        tax.taxAmountInUSD = calculateTax(
          tax.taxType.percentage,
          transaction.conversionResult,
        );
      }

      transaction.calculate();
    }

    if (createNotifyTopppay.status === ToppayNotifyStatus.SUCCESS) {
      targetAccount.balance = String(
        (
          Number(targetAccount.balance) +
          Number(transaction.conversionResultAfterTax)
        ).toFixed(2),
      );

      transaction.transactionStatus = TransactionStatus.PAID;

      await this.accountRepository.save([targetAccount]);

      await this.transactionRepository.save([transaction]);

      const notify = this.notifyRepository.create({
        amount: transaction.amount,
        reference: transaction.reference,
        status: TransactionStatus.PAID,
        notifiedBy: NotifiedBy.TOPPAY,
      });

      await this.notifyRepository.save(notify);

      return {
        message: 'Notification Received',
      };
    }

    await this.transactionRepository.update(transaction.idTransaction, {
      transactionStatus:
        createNotifyTopppay.status === ToppayNotifyStatus.PENDING
          ? TransactionStatus.PENDING
          : TransactionStatus.FAILED,
    });

    const notify = this.notifyRepository.create({
      amount: transaction.amount,
      reference: transaction.reference,
      status:
        createNotifyTopppay.status === ToppayNotifyStatus.PENDING
          ? TransactionStatus.PENDING
          : TransactionStatus.FAILED,
      notifiedBy: NotifiedBy.TOPPAY,
    });

    await this.notifyRepository.save(notify);

    return {
      message: 'Notification Received',
    };
  }
}
