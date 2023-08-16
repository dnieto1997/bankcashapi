import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DigitalCardStatus } from '../enums/digital-card-status.enum';
import { Account } from 'src/account/entities/account.entity';

@Entity()
export class DigitalCard {
  @PrimaryGeneratedColumn({ name: 'id_digital_card' })
  idDigitalCard: number;

  @Column('varchar', {
    name: 'number_of_card',
    length: 191,
    unique: true,
  })
  numberOfCard: string;

  @Column('date', {
    name: 'expiration_date',
  })
  expirationDate: Date;

  @Column('bigint', {
    comment: 'Card Verification Value',
  })
  cvv: number;

  @Column('enum', {
    enum: DigitalCardStatus,
    default: DigitalCardStatus.ACTIVE,
  })
  status: DigitalCardStatus;

  @ManyToOne(() => Account, (account) => account.digitalCard)
  @JoinColumn({ name: 'id_account' })
  account: Account;
}
