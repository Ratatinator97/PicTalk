import { BaseEntity } from 'typeorm';
import { User } from '../auth/user.entity';
import { Picto } from './picto.entity';
export declare class Collection extends BaseEntity {
    id: number;
    path: string;
    name: string;
    color: string;
    pictos: Picto[];
    user: User;
    userId: number;
}
