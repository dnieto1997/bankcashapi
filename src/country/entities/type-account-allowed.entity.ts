import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MehtodsPayout } from './methods-payout.entity';

@Entity()
export class TypeAccountAllowed {
  @PrimaryGeneratedColumn({ name: 'id_type_account_llowed' })
  idTypeAccountAllowed: number;

  @Column('varchar')
  type: string;

  @ManyToOne(
    () => MehtodsPayout,
    (methodsPayout) => methodsPayout.typeAccountAllowed,
  )
  @JoinColumn({ name: 'id_methods_payout' })
  mehtodsPayout: MehtodsPayout;
}
