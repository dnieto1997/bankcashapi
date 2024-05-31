import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Country } from './country.entity';

@Entity()
export class DocuemntsAllowed {
  @PrimaryGeneratedColumn({ name: 'id_document' })
  idDocument: number;

  @Column('varchar')
  type: string;

  @ManyToOne(() => Country, (country) => country.documentsAllowed)
  @JoinColumn({ name: 'id_country' })
  country: Country;
}
