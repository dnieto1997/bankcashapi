import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn({ name: 'id_currency' })
  idCurrency: number;

  @Column('varchar', {
    unique: true,
    length: 191,
  })
  code: string;

  // @Column('varchar', {
  //   unique: true,
  //   length: 191,
  // })
  // name: string;

  @Column('varchar', {
    name: 'exchange_value',
  })
  exchangeValue: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
