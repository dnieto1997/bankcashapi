import {
  AfterLoad,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserStatus } from '../enums';
import { UserRole } from './user-role.entity';
import { capitalize } from '../../common/helpers/capitalize.helper';
import { Account } from 'src/account/entities/account.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CashOutRequests } from 'src/cash-out-requests/entities/cash-out-request.entity';
import { Country } from 'src/country/entities';
import { TypeDocument } from './type-document.entity';
// import { Country } from 'src/country/entities';

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

  @Column('varchar', {
    name: 'url_document',
  })
  urlDocument: string;

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

  @ApiProperty()
  @Column('enum', {
    enum: UserStatus,
    default: UserStatus.INACTIVE,
  })
  status: UserStatus;

  // @ApiProperty()
  // @Column('varchar')
  // city: string;

  // @ApiProperty()
  // @Column('varchar')
  // address: string;

  // @Column('varchar')
  // postcode: string;

  // @ManyToOne(() => Country, (country) => country.user, {
  //   eager: true,
  // })
  // @JoinColumn({ name: 'id_country' })
  // country: Country;

  public get fullName(): string {
    return `${this.names} ${this.surnames}`;
  }

  @ManyToOne(() => UserRole, (role) => role.user, {
    // eager: true,
  })
  @JoinColumn({ name: 'id_user_role' })
  role: UserRole;

  @OneToOne(() => Account, (account) => account.user, {
    // eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'id_account' })
  account: Account;

  @OneToMany(() => CashOutRequests, (cashOutRequests) => cashOutRequests.user)
  cashOutRequests: CashOutRequests;

  @ManyToOne(() => Country, (country) => country.users)
  @JoinColumn({ name: 'id_country' })
  country: Country;

  @ManyToOne(() => TypeDocument, (typeDocument) => typeDocument.users)
  @JoinColumn({ name: 'id_type_document' })
  typeDocument: TypeDocument;

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
