import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn({ name: 'id_user_role' })
  idUserRole: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  description: string;

  @OneToMany(() => User, (user) => user.role)
  user: User;
}
