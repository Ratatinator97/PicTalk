import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PictoRepository } from './picto.repository';
import { User } from 'src/auth/user.entity';
import { Picto } from './picto.entity';
import { CreatePictoDto } from './dto/create-picto.dto';
import { Collection } from './collection.entity';
import { fs } from 'multer';

@Injectable()
export class PictosService {
  constructor(
    @InjectRepository(PictoRepository)
    private pictoRepository: PictoRepository,
  ) {}

  async getPictos(id: number, user: User): Promise<Picto[]> {
    const found = await this.pictoRepository.find({
      where: { fatherId: id, userId: user.id },
    });
    console.log(found);
    if (found.length == 0) {
      throw new NotFoundException(`Task of fatherId "${id}" not found`);
    }
    return found;
  }

  async createPicto(
    createPictoDto: CreatePictoDto,
    user: User,
    filename: string,
  ): Promise<Picto> {
    return this.pictoRepository.createPicto(createPictoDto, user, filename);
  }

  async deletePicto(id: number, user: User): Promise<void> {
    const result = await this.pictoRepository.delete({ id, userId: user.id });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
  }

  async deletePictoOfCollection(
    collection: Collection,
    user: User,
  ): Promise<void> {
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
  }

  async isFolder(id: number, user: User): Promise<boolean> {
    const found = await this.pictoRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!found) {
      return false;
    }
    return found.folder;
  }
}
