import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TypeTransaction } from '../enums/type-transaction.enum';
import { Account } from 'src/account/entities/account.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn({ name: 'id_transaction' })
  idTransaction: number;

  @Column('enum', {
    enum: TypeTransaction,
  })
  typeTransaction: TypeTransaction;

  @Column('varchar')
  amount: string;

  @Column('varchar', {
    name: 'target_account',
    nullable: true,
  })
  targetAccount?: string;

  @Column('varchar')
  reference: string;

  @Column('varchar', {
    name: 'transaction_currency_code',
    nullable: true,
  })
  transactionCurrencyCode: string;

  @Column('varchar', {
    name: 'exchange_value',
    nullable: true,
  })
  exchangeValue: string;

  @Column('timestamp', {
    name: 'created_date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdDate: Date;

  @ManyToOne(() => Account, (account) => account.transactions)
  @JoinColumn({ name: 'id_account' })
  account: Account;
}
