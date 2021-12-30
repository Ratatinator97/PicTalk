import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionRepository } from './collection.repository';
import { User } from '../auth/user.entity';
import { Collection } from './collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { unlink } from 'fs';
import { EditCollectionDto } from './dto/edit-collection.dto';
import { StarterCollectionDto } from './dto/starterCollection.dto';
@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(CollectionRepository)
    private collectionRepository: CollectionRepository,
  ) { }
  private logger = new Logger('TasksController');

  async getUserCollections(user: User): Promise<Collection[]> {
    const collections: Collection[] = await this.collectionRepository.find({
      where: { userId: user.id },
    });
    if (collections.length !== 0) {
      collections.map(collection => {
        delete collection.pictos;
        delete collection.userId;

      });
    }
    return collections;
  }

  async createCollection(
    createCollectionDto: CreateCollectionDto,
    user: User,
    filename: string,
  ): Promise<Collection> {
    return this.collectionRepository.createCollection(
      createCollectionDto,
      user,
      filename,
    );
  }
  async editCollection(
    id: number,
    editCollectionDto: EditCollectionDto,
    user: User,
    filename?: string,
  ): Promise<Collection> {
    if (filename) {
      return this.collectionRepository.editCollection(
        id,
        editCollectionDto,
        user,
        filename,
      );
    } else {
      return this.collectionRepository.editCollection(
        id,
        editCollectionDto,
        user,
      );
    }
  }
  async deleteCollection(id: number, user: User): Promise<void> {
    const collection = await this.collectionRepository.findOne({
      id: id,
      userId: user.id,
    });
    if (!collection) {
      throw new NotFoundException();
    }
    const result = await this.collectionRepository.delete({
      id: id,
      userId: user.id,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Collection with id "${id}" not found`);
    }
    return;
  }

  async alternateStar(id: number, user: User): Promise<void> {
    return this.collectionRepository.alternateStar(id, user);
  }

  async getCollection(id: number, user: User): Promise<Collection> {
    const collection = await this.collectionRepository.findOne({
      where: { userId: user.id, id },
    });
    if (collection) {
      return collection;
    } else {
      throw new NotFoundException(`Collection with id: "${id} not found"`);
    }
  }

  async isCollection(id: number, user: User): Promise<boolean> {
    const found = await this.collectionRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!found) {
      return false;
    }
    return true;
  }

  async createStarterCollections(user: User, starterCollections: StarterCollectionDto[]): Promise<Collection[]> {
    return new Promise(async (resolve, reject) => {
      const promises = starterCollections.map(async (starterCollection) => {
        const createdCollection: Collection = await this.createCollection(
          { name: starterCollection.name, color: starterCollection.color },
          user,
          starterCollection.path,
        );
        return createdCollection;
      });
      const collections = await Promise.all(promises);
      resolve(collections);
    });
  }
}
