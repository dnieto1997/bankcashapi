import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Country } from './country.entity';
import { TypeAccountAllowed } from './type-account-allowed.entity';
@Entity()
export class MehtodsPayout {
  @PrimaryGeneratedColumn({ name: 'id_methods_payout' })
  idMethodsPayout: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  code: string;

  @ManyToOne(() => Country, (country) => country.methodsPayout)
  @JoinColumn({ name: 'id_country' })
  country: Country;

  @OneToMany(
    () => TypeAccountAllowed,
    (typeAccountAllowed) => typeAccountAllowed.mehtodsPayout,
  )
  typeAccountAllowed: TypeAccountAllowed;
}
