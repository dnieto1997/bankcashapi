import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Country } from './country.entity';

@Entity()
export class Banks {
  @PrimaryGeneratedColumn({ name: 'id_bank' })
  idBank: number;

  @Column('varchar')
  code: string;

  @Column('varchar')
  name: string;

  @ManyToOne(() => Country, (country) => country.banks)
  @JoinColumn({ name: 'id_country' })
  country: Country;
}
