import { EntityRepository, Repository } from 'typeorm';
import { Picto } from './picto.entity';
import {
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePictoDto } from './dto/create-picto.dto';
import { User } from 'src/auth/user.entity';
import { CollectionRepository } from './collection.repository';
import { InjectRepository } from '@nestjs/typeorm';
@EntityRepository(Picto)
export class PictoRepository extends Repository<Picto> {
  @InjectRepository(CollectionRepository)
  private collectionRepository: CollectionRepository;

  private logger = new Logger('PictoRepository');

  async createPicto(
    createPictoDto: CreatePictoDto,
    user: User,
    filename: string,
  ) {
    const { speech, meaning, folder, fatherId } = createPictoDto;

    if (!this.isFolder(fatherId, user)) {
      throw new InternalServerErrorException(`This entity is not a folder`);
    }
    const picto = new Picto();

    picto.speech = speech;
    picto.meaning = meaning;
    picto.folder = folder;
    picto.fatherId = fatherId;
    picto.path = filename;
    picto.user = user;

    try {
      await picto.save();
    } catch (error) {
      this.logger.error(
        `Failed to create a picto for user "${
          user.username
        }". Data: ${JSON.stringify(createPictoDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
    delete picto.user;
    return picto;
  }

  async isFolder(id: number, user: User) {
    const picto: Picto = await this.findOne({
      where: { userId: user.id, id: id },
    });
    const collection = await this.collectionRepository.findOne({
      where: { userId: user.id, id: id },
    });

    if (picto) {
      if (picto.folder) {
        return true;
      }
    }
    if (collection) {
      return true;
    }
    if (!collection && !picto) {
      throw new NotFoundException(`Cannot find picto with id "${id}"`);
    }
    return false;
  }
}
