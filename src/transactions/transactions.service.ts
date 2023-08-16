import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { Account } from 'src/account/entities/account.entity';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TypeTransaction } from './enums/type-transaction.enum';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger();

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, account: Account) {
    const { typeTransaction, ...transactionData } = createTransactionDto;

    if (typeTransaction === TypeTransaction.PAYING) {
      delete transactionData.targetAccount;
    }

    if (
      typeTransaction === TypeTransaction.PAYOUT &&
      Number(transactionData.amount) > Number(account.balance)
    ) {
      throw new BadRequestException('insufficient funds');
    }

    try {
      const transaction = this.transactionRepository.create({
        ...transactionData,
        typeTransaction,
        reference: uuidv4(),
        account: {
          idAccount: account.idAccount,
        },
      });

      await this.transactionRepository.save(transaction);
      delete transaction.account;
      return transaction;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }

  private handleDbErrors(error: any) {
    this.logger.error(error);

    throw new InternalServerErrorException('Check server logs');
  }
}
