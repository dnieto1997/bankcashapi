import {
  AfterLoad,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserStatus } from '../enums';
import { UserRole } from './user-role.entity';
import { capitalize } from '../../common/helpers/capitalize.helper';
import { Account } from 'src/account/entities/account.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Country } from 'src/country/entities';

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id_user' })
  idUser: number;

  @ApiProperty()
  @Column('varchar')
  names: string;

  @ApiProperty()
  @Column('varchar')
  surnames: string;

  @ApiProperty()
  @Column('varchar', {
    name: 'num_document',
    unique: true,
    length: 191,
  })
  numDocument: number;

  @ApiProperty()
  @Column('varchar', {
    unique: true,
    length: 191,
  })
  email: string;

  @ApiProperty()
  @Column('varchar', {
    unique: true,
    length: 191,
  })
  cellphone: string;

  @ApiProperty()
  @Column('varchar')
  password: string;

  @ApiProperty()
  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_date',
  })
  createdDate: Date;

  @ApiProperty()
  @Column('enum', {
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @ApiProperty()
  @Column('varchar')
  city: string;

  @ApiProperty()
  @Column('varchar')
  address: string;

  @ManyToOne(() => Country, (country) => country.user, {
    eager: true,
  })
  @JoinColumn({ name: 'id_country' })
  country: Country;

  public get fullName(): string {
    return `${this.names} ${this.surnames}`;
  }

  @ManyToOne(() => UserRole, (role) => role.user, {
    eager: true,
  })
  @JoinColumn({ name: 'id_user_role' })
  role: UserRole;

  @OneToOne(() => Account, (account) => account.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'id_account' })
  account: Account;

  @BeforeInsert()
  checkBeforeInsert() {
    this.names = this.names.toLocaleLowerCase();
    this.surnames = this.surnames.toLocaleLowerCase();
    this.password = bcrypt.hashSync(this.password, 10);
  }

  @AfterLoad()
  capitalizeProperties() {
    this.names = capitalize(this.names);
    this.surnames = capitalize(this.surnames);
  }
}
