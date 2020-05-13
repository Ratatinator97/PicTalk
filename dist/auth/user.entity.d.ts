import { BaseEntity } from 'typeorm';
import { Collection } from '../pictos/collection.entity';
import { Picto } from '../pictos/picto.entity';
export declare class User extends BaseEntity {
    id: number;
    username: string;
    password: string;
    salt: string;
    collections: Collection[];
    pictos: Picto[];
    validatePassword(password: string): Promise<boolean>;
}
