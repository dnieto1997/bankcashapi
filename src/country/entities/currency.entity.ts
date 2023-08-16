import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn({ name: 'id_currency' })
  idCurrency: number;

  @Column('varchar', {
    unique: true,
    length: 191,
  })
  code: string;

  @Column('varchar', {
    name: 'currency_name',
    unique: true,
    length: 191,
  })
  currencyName: string;
}
