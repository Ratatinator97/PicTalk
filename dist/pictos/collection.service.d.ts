import { CollectionRepository } from './collection.repository';
import { User } from '../auth/user.entity';
import { Collection } from './collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
export declare class CollectionService {
    private collectionRepository;
    constructor(collectionRepository: CollectionRepository);
    private logger;
    getUserCollections(user: User): Promise<Collection[]>;
    createCollection(createCollectionDto: CreateCollectionDto, user: User, filename: string): Promise<Collection>;
    deleteCollection(id: number, user: User): Promise<void>;
    getCollection(id: number, user: User): Promise<Collection>;
    isCollection(id: number, user: User): Promise<boolean>;
}
