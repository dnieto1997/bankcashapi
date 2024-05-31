import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountStatus } from '../enums';
import { User } from 'src/users/entities/user.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { DigitalCard } from 'src/products/digital-card/entities/digital-card.entity';
import { AccountRole } from './account-role.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn({ name: 'id_account' })
  idAccount: number;

  @Column('varchar', {
    name: 'number_of_account',
    length: 191,
    unique: true,
  })
  numberOfAccount: string;

  @Column('varchar', {
    default: '0',
  })
  balance: string;

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

  @Column('enum', {
    enum: AccountStatus,
    default: AccountStatus.Active,
  })
  status: AccountStatus;

  // @Column('varchar', {
  //   name: 'local_currency',
  // })
  // localCurrency: string;

  @OneToOne(() => User, (user) => user.account)
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.sourceAccount)
  sourceTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.targetAccount)
  targetTransactions: Transaction[];

  @OneToMany(() => DigitalCard, (digitalCard) => digitalCard.account)
  digitalCard: DigitalCard[];

  // @OneToMany(() => AccountBalance, (accountBalance) => accountBalance.account, {
  //   cascade: true,
  //   // eager: true,
  // })
  // accountBalance: AccountBalance[];

  @ManyToMany(() => AccountRole)
  @JoinTable({
    name: 'account_rols',
    joinColumn: {
      name: 'id_account',
      referencedColumnName: 'idAccount',
    },
    inverseJoinColumn: {
      name: 'id_account_role',
      referencedColumnName: 'idAccountRole',
    },
  })
  accountRols: AccountRole[];
}
