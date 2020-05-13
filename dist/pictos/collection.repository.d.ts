import { Repository } from 'typeorm';
import { Collection } from './collection.entity';
import { User } from 'src/auth/user.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
export declare class CollectionRepository extends Repository<Collection> {
    private logger;
    createCollection(createCollectionDto: CreateCollectionDto, user: User, filename: string): Promise<Collection>;
}
