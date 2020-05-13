import { PictoRepository } from './picto.repository';
import { User } from 'src/auth/user.entity';
import { Picto } from './picto.entity';
import { CreatePictoDto } from './dto/create-picto.dto';
import { Collection } from './collection.entity';
export declare class PictoService {
    private pictoRepository;
    constructor(pictoRepository: PictoRepository);
    private logger;
    getPictos(id: number, user: User, collection: Collection): Promise<Picto[]>;
    createPicto(createPictoDto: CreatePictoDto, user: User, filename: string, collection: Collection): Promise<Picto>;
    deletePicto(id: number, user: User): Promise<void>;
    deletePictoRecursive(picto: Picto, user: User): Promise<any[]>;
    deletePictoOfCollection(collection: Collection, user: User): Promise<void>;
    isFolder(id: number, user: User): Promise<number>;
    getCollection(id: number, user: User): Promise<Collection>;
    deleteMultiple(pictos: Picto[]): Promise<void>;
}
