import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('spots')
export class Spot {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  title!: string;

  @Column({ length: 255 })
  description!: string;

  @Column({ nullable: true })
  imagePath?: string;

  @Column('float')
  latitude!: number;

  @Column('float')
  longitude!: number;

  @Column()
  location!: string;

  @CreateDateColumn()
  timestamp!: Date;

  @ManyToOne(() => User, (user) => user.spots, { onDelete: 'CASCADE' })
  user!: User;
}
