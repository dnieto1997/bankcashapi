// import {
//   Column,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { Account } from './account.entity';

// @Entity()
// export class AccountBalance {
//   @PrimaryGeneratedColumn({ name: 'id_account_balance' })
//   idAccountBalance: number;

//   @Column('varchar')
//   balance: string;

//   // @Column('varchar', {
//   //   name: 'currency_code',
//   // })
//   // currencyCode: string;

//   @ManyToOne(() => Account, (account) => account.accountBalance)
//   @JoinColumn({ name: 'id_account' })
//   account: Account;
// }
