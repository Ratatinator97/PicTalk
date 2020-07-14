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
import { MinioService } from 'nestjs-minio-client';

@EntityRepository(Picto)
export class PictoRepository extends Repository<Picto> {
  private readonly minioClient: MinioService;
  private logger = new Logger('PictoRepository');

  async createPicto(
    createPictoDto: CreatePictoDto,
    user: User,
    filename: string,
    collection: Collection,
  ) {
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
    picto.collection = collection;

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
    this.minioClient.client.bucketExists('pictalk', function(err, exists) {
      if (err) {
        throw new InternalServerErrorException(err);
      }
      if (exists) {
        const file = './tmp/' + filename;
        const metaData = {};
        this.minioClient.client.fPutObject(
          'pictalk',
          filename,
          file,
          metaData,
          function(err, etag) {
            if (err) {
              throw new InternalServerErrorException(err);
            } else {
              this.logger.verbose(
                `Image with name: ${filename} uploaded successfully to minio`,
              );
            }
          },
        );
      }
    });
    delete picto.user;
    delete picto.collection;
    delete picto.userId;
    delete picto.id;
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
            `Collection of path "${picto.path}" successfully deleted`,
          );
        });
        picto.path = filename;
      }
      try {
        await picto.save();
      } catch (error) {
        this.logger.error(
          `Failed to create a collection for user "${
            user.username
          }". Data: ${JSON.stringify(editPictoDto)}`,
          error.stack,
        );
        throw new InternalServerErrorException();
      }
      delete picto.user;
      return picto;
    } else {
      throw new NotFoundException('Edited Collection does not exist');
    }
  }
}
