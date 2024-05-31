import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Banks } from './banks.entity';
import { MehtodsPayout } from './methods-payout.entity';
import { Regions } from './regions.entity';
import { DocuemntsAllowed } from './documents-allowed.entity';
import { User } from 'src/users/entities/user.entity';
// import { Transaction } from 'src/transactions/entities/transaction.entity';

@Entity()
export class Country {
  @PrimaryGeneratedColumn({ name: 'id_country' })
  idCountry: number;

  @Column('varchar', {
    name: 'country_code',
    unique: true,
    length: 191,
  })
  countryCode: string;

  @Column('varchar', {
    name: 'country_name',
    unique: true,
    length: 191,
  })
  countryName: string;

  @Column('varchar', {
    name: 'currency_code',
    nullable: true,
  })
  currencyCode: string;

  @Column('varchar', {
    name: 'currency_name',
    default: true,
  })
  currencyName: string;

  @Column('varchar', {
    name: 'flag_png',
    default: true,
  })
  flagPng: string;

  @Column('varchar', {
    name: 'flag_svg',
    default: true,
  })
  flagSvg: string;

  @OneToMany(() => Banks, (bank) => bank.country)
  banks: Banks;

  @OneToMany(() => MehtodsPayout, (methods) => methods.country)
  methodsPayout: MehtodsPayout;

  @OneToMany(() => Regions, (region) => region.country)
  regions: Regions;

  @OneToMany(() => DocuemntsAllowed, (document) => document.country)
  documentsAllowed: DocuemntsAllowed;

  @OneToMany(() => User, (users) => users.country)
  users: User[];

  // @OneToMany(()=> Transaction, (transaction)=> transaction.c)
  // transactionsInCountry: Transaction

  // @OneToMany(() => User, (user) => user.country)
  // @JoinColumn({ name: 'id_user' })
  // user: User;
}
