import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionRepository } from './collection.repository';
import { User } from '../auth/user.entity';
import { Collection } from './collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';

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
    if (!found) {
      throw new NotFoundException(
        `Collection with fatherId "${user.id}" not found`,
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
    this.collectionRepository.deleteCollection(id, user);
  }
}
