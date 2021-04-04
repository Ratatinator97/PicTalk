import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PictoRepository } from './picto.repository';
import { User } from 'src/auth/user.entity';
import { Picto } from './picto.entity';
import { CreatePictoDto } from './dto/create-picto.dto';
import { Collection } from './collection.entity';
import { unlink } from 'fs';
import { EditPictoDto } from './dto/edit-picto.dto';
import { readFileSync } from 'node:fs';
import { StarterPictoDto } from 'starterPack/starterPicto.dto';
@Injectable()
export class PictoService {
  constructor(
    @InjectRepository(PictoRepository)
    private pictoRepository: PictoRepository,
  ) {}
  private logger = new Logger('PictoController');

  async getPictos(
    id: number,
    user: User,
    collectionId: number,
  ): Promise<Picto[]> {
    const pictos = await this.pictoRepository.find({
      where: { fatherId: id, userId: user.id, collection: collectionId },
      relations: ["collection"]
    });
    await pictos.map(picto => {
      delete picto.userId;
      delete picto.collection;
      Object.assign(picto, {collectionId: collectionId});
    });
    return pictos;
  }

  async createPicto(
    createPictoDto: CreatePictoDto,
    user: User,
    filename: string,
    collectionId: number,
  ): Promise<Picto> {
    return this.pictoRepository.createPicto(
      createPictoDto,
      user,
      filename,
      collectionId,
    );
  }

  async deletePicto(id: number, user: User): Promise<void> {
    const picto: Picto = await this.pictoRepository.findOne({
      where: { id: id, userId: user.id },
    });
    if (picto) {
      await this.deletePictoRecursive(picto, user);
    } else {
      throw new NotFoundException();
    }
  }

  async deletePictoRecursive(picto: Picto, user: User): Promise<any[]> {
    unlink('./files/' + picto.path, () => {
      this.logger.verbose(`Picto of path "${picto.path}" successfully deleted`);
    });
    const pictos: Picto[] = await this.pictoRepository.find({
      where: { fatherId: picto.id, userId: user.id },
    });

    const result = await this.pictoRepository.delete({
      id: picto.id,
      userId: user.id,
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Picto with id "${picto.id}" not found`);
    }
    if (pictos.length == 0) {
      return;
    } else {
      return pictos.map(picto => this.deletePictoRecursive(picto, user));
    }
  }

  async deletePictoOfCollection(
    collection: Collection,
    user: User,
  ): Promise<void> {
    const pictos: Picto[] = await this.pictoRepository.find({
      where: { collection: collection, userId: user.id },
    });
    this.deleteMultiple(pictos);
    try {
      await this.pictoRepository.delete({
        userId: user.id,
        collection: collection,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async editPicto(
    id: number,
    editPictoDto: EditPictoDto,
    user: User,
    filename?: string,
  ): Promise<Picto> {
    if (filename) {
      return this.pictoRepository.editPicto(id, editPictoDto, user, filename);
    } else {
      return this.pictoRepository.editPicto(id, editPictoDto, user);
    }
  }

  async isFolder(id: number, user: User): Promise<number> {
    const found = await this.pictoRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!found) {
      return 0;
    }
    return found.folder;
  }

  async getCollection(id: number, user: User): Promise<Collection> {
    const picto: Picto = await this.pictoRepository.findOne({
      where: { id, userId: user.id },
    });
    try {
      const collection: Collection = picto.collection;
      return collection;
    } catch (error) {
      throw new NotFoundException();
    }
  }
  async alternateStar(id:number, user:User):Promise<void>{
    return this.pictoRepository.alternateStar(id, user);
  }

  async deleteMultiple(pictos: Picto[]) {
    pictos.forEach(picto => {
      unlink('./files/' + picto.path, () => {
        this.logger.verbose(
          `Picto of path "${picto.path}" successfully deleted`,
        );
      });
    });
  }
  async getAllPictos(user:User):Promise<Picto[]>{
    const pictos: Picto[] = await this.pictoRepository.find({
      where: { userId: user.id },
      relations: ["collection"],
    });
    await pictos.map(picto => {
      delete picto.userId;
      Object.assign(picto, {collectionId: picto.collection.id});
      delete picto.collection;
    });
    return pictos;
  }

  async createStarterPackPictosForCollection(user:User, collections:Collection[]):Promise<void>{
    var pictograms:StarterPictoDto[] = require("./../../starterPack/startingPackPictos.json");
    collections.forEach(async collection => {
      let collectionPictos:StarterPictoDto[] = pictograms.filter(pictogram => collection.name == pictogram.collectionName);
      await this.createStarterPackPictos(user, collection.id, collectionPictos);
    });
  }

  async createStarterPackPictos(user:User, collectionId:number, pictograms:StarterPictoDto[]):Promise<void>{
    const rootPictograms:Picto[] = await this.createRootPictos(user, collectionId, pictograms);
    let nonRootPictograms:StarterPictoDto[] = await this.getNonRootPictograms(pictograms);
    const meaningRootPictos:string[] = rootPictograms.map((rootPicto) => rootPicto.meaning);
    while(nonRootPictograms.length != 0){
      nonRootPictograms.forEach(async (picto,index) => {
        let rootFather:string = meaningRootPictos.filter((meaningRootPicto) => meaningRootPicto == picto.fatherMeaning)[0]
        if(rootFather){
          let fatherPicto:Picto = rootPictograms.find((rootPicto) => rootPicto.meaning == rootFather)[0]
          await this.createPicto({meaning: picto.meaning, speech: picto.speech, folder: picto.folder, fatherId: fatherPicto.id}, user, picto.path, collectionId);
        } else {
          let fatherPicto:Picto = await this.findFatherId(picto, nonRootPictograms);
          if(fatherPicto){
            await this.createPicto({meaning: picto.meaning, speech: picto.speech, folder: picto.folder, fatherId: fatherPicto.id}, user, picto.path, collectionId);
            nonRootPictograms.splice(index);
          }
        }
      });
    }
  }

  async getNonRootPictograms(pictograms:any[]):Promise<any>{
    return pictograms.filter((pictogram) => pictogram.fatherId != "0");
  }


  async findFatherId(pictoToInsert, createdPictograms):Promise<Picto>{
    return createdPictograms.filter((pictogram) => {
      pictogram.meaning == pictoToInsert.fatherId
    });
  }

  async createRootPictos(user:User, collectionId:number, pictograms:StarterPictoDto[]):Promise<Picto[]>{
    return new Promise((resolve, reject) => {
      let rootPictograms:Picto[];
      pictograms.filter((pictogram) => pictogram.fatherMeaning == "0").forEach( async (pictogram) => {
        try {
          let picto:Picto = await await this.createPicto(
            { speech: pictogram.speech, meaning: pictogram.meaning, folder: pictogram.folder, fatherId: 0}, 
            user, 
            pictogram.path, 
            collectionId
          );
          rootPictograms.push(picto);
        } catch(err){
          reject(err);
        }
      });
      resolve(rootPictograms);
    });  
  }
}
