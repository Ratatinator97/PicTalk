import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class Picto extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  meaning: string;

  @Column()
  speech: string;

  @Column()
  folder: boolean;

  @Column()
  fatherId: number;

  @ManyToOne(
    type => User,
    user => user.pictos,
    { eager: false },
  )
  user: User;

  @Column()
  userId: number;
}
