import {
  AfterLoad,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { capitalize } from 'src/common/helpers/capitalize.helper';

@Entity()
export class TypeDocument {
  @PrimaryGeneratedColumn({ name: 'id_type_document' })
  idTypeDocument: number;

  @Column('varchar')
  name: string;

  @Column('varchar', {
    name: 'short_name',
  })
  shortName: string;

  @OneToMany(() => User, (user) => user.typeDocument)
  users: User[];

  @AfterLoad()
  transformProperties() {
    this.name = capitalize(this.name);
    this.shortName = this.shortName.toUpperCase();
  }
}
