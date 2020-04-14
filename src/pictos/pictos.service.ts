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

@Injectable()
export class PictosService {
  constructor(
    @InjectRepository(PictoRepository)
    private pictoRepository: PictoRepository,
  ) {}
  private logger = new Logger('TasksController');

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
    const picto: Picto = await this.pictoRepository.findOne({
      where: { id: id, userId: id },
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
      throw new NotFoundException(`Task with id "${picto.id}" not found`);
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

  async isFolder(id: number, user: User): Promise<boolean> {
    const found = await this.pictoRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!found) {
      return false;
    }
    return found.folder;
  }

  async deleteMultiple(pictos: Picto[]) {
    pictos.map(picto => {
      unlink('./files/' + picto.path, () => {
        this.logger.verbose(
          `Picto of path "${picto.path}" successfully deleted`,
        );
      }); //Probablement mettre tout le chemin
    });
  }
}
