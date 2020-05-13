import { User } from 'src/auth/user.entity';
import { Picto } from './picto.entity';
import { PictoService } from './pictos.service';
import { CollectionService } from './collection.service';
import { CreatePictoDto } from './dto/create-picto.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Collection } from './collection.entity';
export declare class PictosController {
    private pictoService;
    private collectionService;
    private logger;
    constructor(pictoService: PictoService, collectionService: CollectionService);
    getUserCollections(user: User): Promise<Collection[]>;
    getPictos(id: number, collectionId: number, user: User): Promise<Picto[]>;
    createPicto(collectionId: number, createPictoDto: CreatePictoDto, user: User, file: any): Promise<Picto>;
    createCollection(file: any, createCollectionDto: CreateCollectionDto, user: User): Promise<Collection>;
    deleteCollection(id: number, user: User): Promise<void>;
    deletePicto(id: number, user: User): Promise<void>;
}
