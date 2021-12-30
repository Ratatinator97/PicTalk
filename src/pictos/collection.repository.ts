import { Repository, EntityRepository } from 'typeorm';
import { Collection } from './collection.entity';
import {
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { EditCollectionDto } from './dto/edit-collection.dto';
import { unlink } from 'fs';

@EntityRepository(Collection)
export class CollectionRepository extends Repository<Collection> {
  private logger = new Logger('PictoRepository');

  async createCollection(
    createCollectionDto: CreateCollectionDto,
    user: User,
    filename: string,
  ): Promise<Collection> {
    const { name, color } = createCollectionDto;
    const collection = new Collection();

    collection.name = name;
    collection.color = color;
    collection.user = user;
    collection.path = filename;
    collection.starred = false;
    try {
      await collection.save();
    } catch (error) {
      this.logger.error(
        `Failed to create a collection for user "${
          user.username
        }". Data: ${JSON.stringify(createCollectionDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
    delete collection.user;
    delete collection.userId;
    delete collection.pictos;
    return collection;
  }
  async editCollection(
    id: number,
    editCollectionDto: EditCollectionDto,
    user: User,
    filename?: string,
  ): Promise<Collection> {
    const { name, color } = editCollectionDto;
    const collection = await this.findOne({
      id: id,
      userId: user.id,
    });
    if (collection) {
      collection.name = name;
      collection.color = color;
      if (filename) {
        collection.path = filename;
      }
      try {
        await collection.save();
      } catch (error) {
        this.logger.error(
          `Failed to create a collection for user "${
            user.username
          }". Data: ${JSON.stringify(editCollectionDto)}`,
          error.stack,
        );
        throw new InternalServerErrorException();
      }
      delete collection.user;
      delete collection.userId;
      delete collection.pictos;
      return collection;
    } else {
      throw new NotFoundException('Edited Collection does not exist');
    }
  }
  async alternateStar(id:number, user:User):Promise<void>{
    const collection = await this.findOne({id: id, userId:user.id});
    if(collection){
      collection.starred ? collection.starred = false : collection.starred = true;
      try {
        await collection.save();
        return;
      } catch (error) {
        this.logger.error(
          `Failed to edit star of a pictogram for user "${
            user.username
          }". Data: ${JSON.stringify(collection.id)}`,
          error.stack,
        );
        throw new InternalServerErrorException();
      }
    } else {
      throw new NotFoundException('Starred collection does not exist');
    }
  }
}
