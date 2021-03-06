import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Collection } from '../pictos/collection.entity';
import { Picto } from '../pictos/picto.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  language: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  resetPasswordToken: string;

  @Column()
  resetPasswordExpires: string;

  @OneToMany(
    type => Collection,
    collection => collection.user,
    { eager: false },
  )
  collections: Collection[];

  @OneToMany(
    type => Picto,
    picto => picto.user,
    { eager: false },
  )
  pictos: Picto[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
