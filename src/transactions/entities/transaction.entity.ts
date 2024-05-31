import {
  BeforeInsert,
  // BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// import { TypeTransaction as TypeTransactionEnum } from '../enums/type-transaction.enum';
import { Account } from 'src/account/entities/account.entity';
import { TransactionStatus } from '../enums/transaction-status';
import { CashOutRequests } from 'src/cash-out-requests/entities/cash-out-request.entity';
import { TypeTransaction } from './type-transaction.entity';
import { Taxes } from './taxes.entity';
// import { Country } from 'src/country/entities';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn({ name: 'id_transaction' })
  idTransaction: number;

  // @Column('enum', {
  //   enum: TypeTransactionEnum,
  // })
  // typeTransaction: TypeTransactionEnum;

  @ManyToOne(
    () => TypeTransaction,
    (typeTransaction) => typeTransaction.transactions,
  )
  @JoinColumn({ name: 'id_type_transaction' })
  typeTransaction: TypeTransaction;

  @Column('varchar')
  amount: string;

  @Column('varchar', {
    name: 'amount_after_tax',
  })
  amountAfterTax: string;

  @Column('varchar', {
    name: 'conversion_result_after_tax',
  })
  conversionResultAfterTax: string;

  // @Column('varchar', {
  //   name: 'target_accounts',
  //   nullable: true,
  // })
  // targetAccounts?: string;

  @Column('varchar')
  reference: string;

  @Column('varchar', {
    name: 'country_code',
  })
  countryCode: string;

  @Column('varchar', {
    name: 'transaction_currency_code',
    nullable: true,
  })
  transactionCurrencyCode: string;

  // @Column('varchar', {
  //   nullable: true,
  // })
  // method?: string;

  // @Column('varchar', {
  //   nullable: true,
  // })
  // documentType?: string;

  // @Column('varchar', {
  //   nullable: true,
  // })
  // bankCode?: string;

  // @Column('varchar', {
  //   nullable: true,
  // })
  // accountType?: string;

  // @Column('varchar', {
  //   nullable: true,
  // })
  // region?: string;

  // @Column('varchar', {
  //   nullable: true,
  // })
  // branch?: string;

  @Column('varchar', {
    name: 'conversion_rate',
    nullable: true,
  })
  conversionRate: string;

  @Column('varchar', {
    name: 'conversion_result',
    nullable: true,
  })
  conversionResult: string;

  @Column('varchar', {
    nullable: true,
  })
  description?: string;

  // @Column('varchar', {
  //   nullable: true,
  // })
  // commentOfAdmin?: string;

  // @Column('timestamp', {
  //   name: 'created_date',
  //   default: () => 'CURRENT_TIMESTAMP',
  // })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'udatep_at',
    type: 'timestamp',
  })
  updatedAt: Date;

  @Column('enum', {
    name: 'transaction_status',
    enum: TransactionStatus,
  })
  transactionStatus: TransactionStatus;

  @ManyToOne(() => Account, (account) => account.sourceTransactions)
  @JoinColumn({ name: 'source_account_id' })
  sourceAccount: Account;

  @ManyToOne(() => Account, (account) => account.targetTransactions)
  @JoinColumn({ name: 'target_account_id' })
  targetAccount?: Account;

  @OneToOne(() => CashOutRequests, (cashOutRequests) => cashOutRequests)
  @JoinColumn({ name: 'id_cash_out_requests' })
  cashOutRequests?: CashOutRequests;

  @OneToMany(() => Taxes, (taxes) => taxes.transaction, {
    cascade: true,
  })
  taxes: Taxes[];

  // countryOfOrigin: Country

  @BeforeInsert()
  // @BeforeUpdate()
  calculate() {
    // console.log(this.taxes);
    const { totalAmountTax, totalAmountInUSD } = this.taxes.reduce(
      (acc, tax) => ({
        totalAmountTax: acc.totalAmountTax + Number(tax.taxAmount),
        totalAmountInUSD: acc.totalAmountInUSD + Number(tax.taxAmountInUSD),
      }),
      {
        totalAmountTax: 0,
        totalAmountInUSD: 0,
      },
    );

    this.amountAfterTax = String(
      (Number(this.amount) - totalAmountTax).toFixed(2),
    );

    this.conversionResultAfterTax = String(
      (Number(this.conversionResult) - totalAmountInUSD).toFixed(2),
    );
  }
}
