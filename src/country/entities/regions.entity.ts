import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Country } from './country.entity';

@Entity()
export class Regions {
  @PrimaryGeneratedColumn({ name: 'id_region' })
  idRegion: number;

  @Column('varchar')
  name: string;

  @ManyToOne(() => Country, (country) => country.regions)
  @JoinColumn({ name: 'id_country' })
  country: Country;
}
