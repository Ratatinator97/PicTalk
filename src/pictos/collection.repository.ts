import { Repository, EntityRepository } from 'typeorm';
import { Collection } from './collection.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { PictoRepository } from './picto.repository';
import { InjectRepository } from '@nestjs/typeorm';

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
    return collection;
  }
}
