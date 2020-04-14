import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionRepository } from './collection.repository';
import { User } from '../auth/user.entity';
import { Collection } from './collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { unlink } from 'fs';
@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(CollectionRepository)
    private collectionRepository: CollectionRepository,
  ) {}
  private logger = new Logger('TasksController');

  async getUserCollections(user: User): Promise<Collection[]> {
    const found = await this.collectionRepository.find({
      where: { userId: user.id },
    });
    if (found.length == 0) {
      throw new NotFoundException(
        `The user "${user.id}" doen't have any Collections`,
      );
    }
    return found;
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

  async deleteCollection(id: number, user: User): Promise<Collection> {
    const collection = await this.collectionRepository.findOne({
      id: id,
      userId: user.id,
    });
    if (!collection) {
      throw new NotFoundException();
    }

    unlink('./files/' + collection.path, () => {
      this.logger.verbose(
        `Collection of path "${collection.path}" successfully deleted`,
      );
    });
    const result = await this.collectionRepository.delete({
      id: id,
      userId: user.id,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Collection with id "${id}" not found`);
    }
    return collection;
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
}
