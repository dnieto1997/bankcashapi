import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CashOutRequestsStatus } from '../enums/cash-out-requestes-status.enum';
import { User } from 'src/users/entities/user.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';

@Entity()
export class CashOutRequests {
  @PrimaryGeneratedColumn({ name: 'id_cash_out_requests' })
  idCashOutRequests: number;

  @Column('varchar', {
    name: 'country_code',
  })
  countryCode: string;

  @Column('varchar', {
    name: 'currency_code',
  })
  currencyCode: string;

  @Column('varchar', {
    name: 'requested_amount',
  })
  requestedAmount: string;

  @Column('varchar', {
    nullable: true,
  })
  method?: string;

  @Column('varchar', {
    nullable: true,
  })
  document?: string;

  @Column('varchar', {
    name: 'document_type',
    nullable: true,
  })
  documentType?: string;

  @Column('varchar', {
    name: 'bank_code',
    nullable: true,
  })
  bankCode?: string;

  @Column('varchar', {
    name: 'account_type',
    nullable: true,
  })
  accountType?: string;

  @Column('varchar', {
    nullable: true,
  })
  region?: string;

  @Column('varchar', {
    nullable: true,
  })
  branch?: string;

  @Column('varchar', {
    nullable: true,
  })
  firstName?: string;

  @Column('varchar', {
    nullable: true,
  })
  lastName?: string;

  @Column('varchar', {
    nullable: true,
  })
  email?: string;

  @Column('varchar', {
    nullable: true,
  })
  phone?: string;

  @Column('varchar', {
    nullable: true,
  })
  account?: string;

  @Column('varchar', {
    nullable: true,
  })
  commentOfAdmin?: string;

  @Column('enum', {
    name: 'status_application',
    enum: CashOutRequestsStatus,
    default: CashOutRequestsStatus.PENDING,
  })
  statusApplication?: CashOutRequestsStatus;

  @CreateDateColumn({
    name: 'date_of_application',
    type: 'timestamp',
  })
  dateOfApplication: Date;

  @UpdateDateColumn({
    name: 'date_of_approval',
    type: 'timestamp',
  })
  dateOfApproval: Date;

  @Column('varchar', {
    nullable: true,
  })
  comments?: string;

  @ManyToOne(() => User, (user) => user.cashOutRequests, {
    // eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'id_user' })
  user: User;

  @OneToOne(() => Transaction, (transaction) => transaction.cashOutRequests)
  transaction?: Transaction;
}
