import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Collection } from './collection.entity';

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
  folder: number;

  @Column()
  fatherId: number;

  @ManyToOne(
    type => Collection,
    collection => collection.pictos,
    { eager: false },
  )
  collection: Collection;

  @ManyToOne(
    type => User,
    user => user.pictos,
    { eager: false },
  )
  user: User;

  @Column()
  userId: number;

  @Column()
  starred: boolean;
}
