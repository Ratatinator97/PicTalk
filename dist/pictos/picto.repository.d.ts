import { Repository } from 'typeorm';
import { Picto } from './picto.entity';
import { CreatePictoDto } from './dto/create-picto.dto';
import { User } from 'src/auth/user.entity';
import { Collection } from './collection.entity';
export declare class PictoRepository extends Repository<Picto> {
    private logger;
    createPicto(createPictoDto: CreatePictoDto, user: User, filename: string, collection: Collection): Promise<Picto>;
}
