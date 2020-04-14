import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionRepository } from './collection.repository';
import { User } from '../auth/user.entity';
import { Collection } from './collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { fs } from 'multer';
@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(CollectionRepository)
    private collectionRepository: CollectionRepository,
  ) {}

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

  async deleteCollection(id: number, user: User): Promise<void> {
    const collection = await this.collectionRepository.findOne({
      id,
      userId: user.id,
    });
    fs.unlink(collection.path);
    const result = await this.collectionRepository.delete({
      id,
      userId: user.id,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id "${id}" not found`);
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
}
