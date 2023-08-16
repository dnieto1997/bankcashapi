import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from './account.entity';

@Entity()
export class AccountRole {
  @PrimaryGeneratedColumn({ name: 'id_account_role' })
  idAccountRole: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  description: string;

  @ManyToMany(() => Account, (account) => account.accountRols)
  account: Account;
}
