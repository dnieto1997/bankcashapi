import { TransactionStatus } from 'src/transactions/enums/transaction-status';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { NotifiedBy } from '../enums/notified-by.enum';

@Entity()
export class Notify {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('enum', {
    enum: TransactionStatus,
  })
  status: string;

  @Column('varchar', {
    nullable: true,
  })
  message?: string;

  @Column('varchar')
  amount: string;

  @Column('varchar', {
    unique: true,
    length: 191,
  })
  reference: string;

  @Column('enum', {
    name: 'notified_by',
    enum: NotifiedBy,
  })
  notifiedBy: NotifiedBy;
}
