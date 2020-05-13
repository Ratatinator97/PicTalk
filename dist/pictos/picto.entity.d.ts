import { BaseEntity } from 'typeorm';
import { User } from '../auth/user.entity';
import { Collection } from './collection.entity';
export declare class Picto extends BaseEntity {
    id: number;
    path: string;
    meaning: string;
    speech: string;
    folder: number;
    fatherId: number;
    collection: Collection;
    user: User;
    userId: number;
}
