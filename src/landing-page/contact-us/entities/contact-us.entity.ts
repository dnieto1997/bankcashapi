import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ContactUs {
  @PrimaryGeneratedColumn({ name: 'id_contact_us' })
  idContactUs: number;

  @Column('varchar', {
    name: 'full_name',
  })
  fullName: string;

  @Column('varchar')
  email: string;

  @Column('varchar')
  asunto: string;

  @Column('varchar')
  message: string;

  @Column('datetime', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
