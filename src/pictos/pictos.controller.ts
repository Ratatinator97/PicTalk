import {
  Controller,
  UseGuards,
  Logger,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  UseInterceptors,
  UploadedFile,
  InternalServerErrorException,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Picto } from './picto.entity';
import { PictosService } from './pictos.service';
import { CollectionService } from './collection.service';
import { CreatePictoDto } from './dto/create-picto.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Collection } from './collection.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, editFileName } from './file-upload.utils';
import { diskStorage } from 'multer';

@Controller('pictalk')
@UseGuards(AuthGuard())
export class PictosController {
  private logger = new Logger('TasksController');
  constructor(
    private pictosService: PictosService,
    private collectionService: CollectionService,
  ) {}

  @Get('/collection')
  getUserCollections(@GetUser() user: User): Promise<Collection[]> {
    this.logger.verbose(`User "${user.username}" retrieving collections`);
    return this.collectionService.getUserCollections(user);
  }

  @Get('picto/:id/:collectionId')
  async getPictos(
    @Param('id', ParseIntPipe) id: number,
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @GetUser() user: User,
  ): Promise<Picto[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving childs pictos of "${id}" of "${user.username}"`,
    );
    const collection: Collection = await this.collectionService.getCollection(
      collectionId,
      user,
    );
    return this.pictosService.getPictos(id, user, collection);
  }

  @Post('/picto/:collectionId')
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async createPicto(
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @Body() createPictoDto: CreatePictoDto,
    @GetUser() user: User,
    @UploadedFile() file,
  ): Promise<Picto> {
    if (file) {
      let isFolder: number;
      if (createPictoDto.fatherId != 0) {
        isFolder = await this.pictosService.isFolder(
          createPictoDto.fatherId,
          user,
        );
      } else {
        isFolder = 1;
      }

      if (isFolder) {
        this.logger.verbose(
          `User "${user.username}" creating a new Picto. Data: ${JSON.stringify(
            createPictoDto,
          )} of "${user.username}"`,
        );
        const collection: Collection = await this.collectionService.getCollection(
          collectionId,
          user,
        );
        return this.pictosService.createPicto(
          createPictoDto,
          user,
          file.filename,
          collection,
        );
      } else {
        throw new InternalServerErrorException(
          `Collection doesn't exist OR the picto with id: "${createPictoDto.fatherId}" isn't a folder`,
        );
      }
    } else {
      throw new InternalServerErrorException('File needed');
    }
  }

  @Post('/collection')
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  createCollection(
    @UploadedFile() file,
    @Body() createCollectionDto: CreateCollectionDto,
    @GetUser() user: User,
  ): Promise<Collection> {
    this.logger.verbose(
      `User "${
        user.username
      }" creating a new collection. Data: ${JSON.stringify(
        createCollectionDto,
      )} of "${user.username}"`,
    );
    if (file) {
      return this.collectionService.createCollection(
        createCollectionDto,
        user,
        file.filename,
      );
    } else {
      throw new InternalServerErrorException('File needed');
    }
  }

  @Delete('/collection/:id')
  async deleteCollection(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    const collection: Collection = await this.collectionService.getCollection(
      id,
      user,
    );
    try {
      this.pictosService.deletePictoOfCollection(collection, user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
    return this.collectionService.deleteCollection(id, user);
  }

  @Delete('/picto/:id')
  deletePicto(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.pictosService.deletePicto(id, user);
  }
}
