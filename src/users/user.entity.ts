import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Spot } from '../spots/spot.entity';
import { Contact } from '../contacts/contact.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => Spot, (spot) => spot.user)
  spots!: Spot[];

  @OneToMany(() => Contact, (contact) => contact.user)
  contacts!: Contact[];
}
