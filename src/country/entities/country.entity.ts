import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  idCountry: number;

  @Column('varchar')
  name: string;

  @Column('varchar', {
    name: 'currency_code',
    unique: true,
    length: 191,
  })
  curencyCode: string;

  @Column('varchar', {
    name: 'currency_name',
    unique: true,
    length: 191,
  })
  currencyName: string;

  @OneToMany(() => User, (user) => user.country)
  @JoinColumn({ name: 'id_user' })
  user: User;
}
