import { Repository, EntityRepository } from 'typeorm';
import { Collection } from './collection.entity';
import {
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { PictoRepository } from './picto.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { fs } from 'multer';
import { Picto } from './picto.entity';
@EntityRepository(Collection)
export class CollectionRepository extends Repository<Collection> {
  @InjectRepository(PictoRepository)
  private pictoRepository: PictoRepository;

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

  async deleteCollection(id: number, user: User): Promise<void> {
    const collection: Collection = await this.findOne({
      where: { userId: user.id, id: id },
    });
    if (!collection) {
      throw new NotFoundException();
    }
    const pictos: Picto[] = await this.pictoRepository.find({
      where: { collection: collection, userId: user.id },
    });
    pictos.map(picto => {
      fs.unlink(picto.path); //Probablement mettre tout le chemin
    });
    try {
      await this.pictoRepository.delete({
        userId: user.id,
        collection: collection,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
    fs.unlink(collection.path);
    const result = await this.pictoRepository.delete({ id, userId: user.id });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
  }
}
