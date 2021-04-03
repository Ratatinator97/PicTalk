import { EntityRepository, Repository } from 'typeorm';
import { Picto } from './picto.entity';
import {
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePictoDto } from './dto/create-picto.dto';
import { User } from 'src/auth/user.entity';
import { Collection } from './collection.entity';
import { EditPictoDto } from './dto/edit-picto.dto';
import { unlink } from 'fs';

@EntityRepository(Picto)
export class PictoRepository extends Repository<Picto> {
  private logger = new Logger('PictoRepository');

  async createPicto(
    createPictoDto: CreatePictoDto,
    user: User,
    filename: string,
    collectionId: number,
  ):Promise<Picto> {
    const { speech, meaning, folder, fatherId } = createPictoDto;
    const picto = new Picto();
    if (fatherId != 0) {
      const found: Picto = await this.findOne({
        where: { id: fatherId, userId: user.id },
      });
      if (!found) {
        throw new NotFoundException();
      }
    }

    picto.speech = speech;
    picto.meaning = meaning;
    picto.folder = folder;
    picto.fatherId = fatherId;
    picto.path = filename;
    picto.user = user;
    picto.collection = { id: collectionId } as any;
    picto.starred = false;
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
    delete picto.collection;
    delete picto.userId;
    return picto;
  }

  async editPicto(
    id: number,
    editPictoDto: EditPictoDto,
    user: User,
    filename?: string,
  ): Promise<Picto> {
    const { speech, meaning, folder, fatherId } = editPictoDto;
    const picto = await this.findOne({
      id: id,
      userId: user.id,
    });
    if (picto) {
      picto.speech = speech;
      picto.meaning = meaning;
      picto.folder = folder;
      picto.fatherId = fatherId;
      if (filename) {
        unlink('./files/' + picto.path, () => {
          this.logger.verbose(
            `Pictogram of path "${picto.path}" successfully deleted`,
          );
        });
        picto.path = filename;
      }
      try {
        await picto.save();
      } catch (error) {
        this.logger.error(
          `Failed to create a pictogram for user "${
            user.username
          }". Data: ${JSON.stringify(editPictoDto)}`,
          error.stack,
        );
        throw new InternalServerErrorException();
      }
      delete picto.user;
      delete picto.collection;
      delete picto.userId;
      return picto;
    } else {
      throw new NotFoundException('Edited Pictogram does not exist');
    }
  }
  async alternateStar(id:number, user:User):Promise<void>{
    const picto = await this.findOne({id: id, userId:user.id});
    if(picto){
      picto.starred ? picto.starred = false : picto.starred = true;
      try {
        await picto.save();
        return;
      } catch (error) {
        this.logger.error(
          `Failed to edit star of a pictogram for user "${
            user.username
          }". Data: ${JSON.stringify(picto.id)}`,
          error.stack,
        );
        throw new InternalServerErrorException();
      }
    } else {
      throw new NotFoundException('Starred pictogram does not exist');
    }
  }
}
