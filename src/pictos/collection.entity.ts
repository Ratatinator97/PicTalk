import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Picto } from './picto.entity';

@Entity()
export class Collection extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  name: string;

  @Column()
  color: string;

  @OneToMany(
    type => Picto,
    picto => picto.collection,
    { eager: false },
  )
  pictos: Picto[];

  @ManyToOne(
    type => User,
    user => user.collections,
    { eager: false },
  )
  user: User;

  @Column()
  userId: number;
}
