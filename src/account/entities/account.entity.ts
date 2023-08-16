import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccountStatus } from '../enums';
import { User } from 'src/users/entities/user.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { DigitalCard } from 'src/products/digital-card/entities/digital-card.entity';
import { AccountRole } from './account-role.entity';
import { AccountBalance } from './account-balance.entity';

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

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_date',
  })
  createdDate: Date;

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

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];

  @OneToMany(() => DigitalCard, (digitalCard) => digitalCard.account)
  digitalCard: DigitalCard[];

  @OneToMany(() => AccountBalance, (accountBalance) => accountBalance.account)
  accountBalance: AccountBalance;

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
