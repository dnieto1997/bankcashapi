import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from './transaction.entity';
import { Taxes } from './taxes.entity';

@Entity()
export class TypeTransaction {
  @PrimaryGeneratedColumn({ name: 'id_type_transaction' })
  idTypeTransaction: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  description: string;

  @Column('int', {
    nullable: true,
  })
  percentage?: number;

  @OneToMany(() => Transaction, (transaction) => transaction.typeTransaction)
  transactions: Transaction[];

  @OneToMany(() => Taxes, (taxes) => taxes.taxType)
  taxes: Taxes[];
}
