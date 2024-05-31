import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TypeTransaction } from './type-transaction.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class Taxes {
  @PrimaryGeneratedColumn({ name: 'id_tax' })
  idTax: number;

  @Column('int')
  percentage: number;

  @Column('varchar', {
    name: 'tax_amount',
  })
  taxAmount: string;

  @Column('varchar', {
    name: 'tax_amount_in_usd',
  })
  taxAmountInUSD: string;

  // @Column('varchar', {
  //   name: 'amount_after_tax',
  // })
  // amountAfterTax: string;

  // @Column('varchar', {
  //   name: 'conversion_result_after_tax',
  // })
  // conversionResultAfterTax: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;

  @ManyToOne(() => TypeTransaction, (typeTransaction) => typeTransaction.taxes)
  @JoinColumn({ name: 'id_type_transaction' })
  taxType: TypeTransaction;

  @ManyToOne(() => Transaction, (transaction) => transaction.taxes)
  @JoinColumn({ name: 'id_transaction' })
  transaction: Transaction;

  // @BeforeInsert()
  // @BeforeUpdate()
  // calculateTax() {
  //   this.percentage = this.taxType.percentage;

  //   this.taxAmount = String(
  //     (
  //       (Number(this.transaction.amount) * this.taxType.percentage) /
  //       100
  //     ).toFixed(2),
  //   );

  //   this.taxAmountInUSD = String(
  //     (
  //       (Number(this.transaction.conversionResult) * this.taxType.percentage) /
  //       100
  //     ).toFixed(2),
  //   );
  // }
}
