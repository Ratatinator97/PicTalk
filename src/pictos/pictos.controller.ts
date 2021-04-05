import {
  Controller,
  UseGuards,
  Logger,
  Get,
  Res,
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
  Put,
  Header
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Picto } from './picto.entity';
import { PictoService } from './pictos.service';
import { CollectionService } from './collection.service';
import { CreatePictoDto } from './dto/create-picto.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Collection } from './collection.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, editFileName } from './file-upload.utils';
import { diskStorage } from 'multer';
import { EditCollectionDto } from './dto/edit-collection.dto';
import { EditPictoDto } from './dto/edit-picto.dto';
import { NoDuplicatasService } from './noDuplicatas.service';
@Controller('pictalk')
export class PictosController {
  private logger = new Logger('PictosController');
  constructor(
    private pictoService: PictoService,
    private collectionService: CollectionService,
    private noDuplicatasService: NoDuplicatasService
  ) {}

  @Get('/allPictos')
  @UseGuards(AuthGuard())
  getAllPictos(
    @GetUser() user: User,
  ): Promise<Picto[]>{
    this.logger.verbose(`User "${user.username}" getting all pictos`);
    return this.pictoService.getAllPictos(user);
  }
  @Get('/collection')
  @UseGuards(AuthGuard())
  getUserCollections(@GetUser() user: User): Promise<Collection[]> {
    this.logger.verbose(`User "${user.username}" retrieving collections`);
    return this.collectionService.getUserCollections(user);
  }

  @Get('/picto/:id/:collectionId')
  @UseGuards(AuthGuard())
  async getPictos(
    @Param('id', ParseIntPipe) id: number,
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @GetUser() user: User,
  ): Promise<Picto[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving childs pictos of "${id}" of "${user.username}"`,
    );

    return this.pictoService.getPictos(id, user, collectionId);
  }

  @Put('/picto/:id/star')
  @UseGuards(AuthGuard())
  async alternateStar(
    @Param('id', ParseIntPipe) id:number,
    @GetUser() user:User
  ): Promise<void>{
    return this.pictoService.alternateStar(id, user);
  }

  @Put('/collection/:id/star')
  @UseGuards(AuthGuard())
  async alternateStarCollection(
    @Param('id', ParseIntPipe) id:number,
    @GetUser() user:User
  ): Promise<void>{
    return this.collectionService.alternateStar(id, user);
  }


  @Post('/picto/:collectionId')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './tmp',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async createPicto(
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @Body() createPictoDto: CreatePictoDto,
    @GetUser() user: User,
    @UploadedFile() file:Express.Multer.File ,
  ): Promise<Picto> {
    if (file) {
      let isFolder: number;
      if (createPictoDto.fatherId != 0) {
        isFolder = await this.pictoService.isFolder(
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
            
        const filename:string = await this.noDuplicatasService.noDuplicatas(file.filename);
        return this.pictoService.createPicto(
          createPictoDto,
          user,
          filename,
          collectionId,
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
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './tmp',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async createCollection(
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
      const filename:string = await this.noDuplicatasService.noDuplicatas(file.filename);
      return this.collectionService.createCollection(
        createCollectionDto,
        user,
        filename,
      );
    } else {
      throw new InternalServerErrorException('File needed');
    }
  }

  @Put('/collection/:id')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './tmp',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async editCollection(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file,
    @Body() editCollectionDto: EditCollectionDto,
    @GetUser() user: User,
  ): Promise<Collection> {
    this.logger.verbose(
      `User "${user.username}" editing a collection. Data: ${JSON.stringify(
        editCollectionDto,
      )} of "${user.username}"`,
    );
    if (file) {
      const filename:string = await this.noDuplicatasService.noDuplicatas(file.filename);
      return this.collectionService.editCollection(
        id,
        editCollectionDto,
        user,
        filename,
      );
    } else {
      return this.collectionService.editCollection(id, editCollectionDto, user);
    }
  }

  @Put('/picto/:id/:collectionId')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './tmp',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async editPicto(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file,
    @Body() editPictoDto: EditPictoDto,
    @GetUser() user: User,
  ): Promise<Picto> {
    this.logger.verbose(
      `User "${user.username}" editing picto. Data: ${JSON.stringify(
        editPictoDto,
      )} of "${user.username}"`,
    );
    if (file) {
      const filename:string = await this.noDuplicatasService.noDuplicatas(file.filename);
      return this.pictoService.editPicto(id, editPictoDto, user, filename);
    } else {
      return this.pictoService.editPicto(id, editPictoDto, user);
    }
  }

  @Delete('/collection/:id')
  @UseGuards(AuthGuard())
  async deleteCollection(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    const collection: Collection = await this.collectionService.getCollection(
      id,
      user,
    );
    try {
      this.pictoService.deletePictoOfCollection(collection, user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
    return this.collectionService.deleteCollection(id, user);
  }

  @Delete('/picto/:id')
  @UseGuards(AuthGuard())
  deletePicto(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.pictoService.deletePicto(id, user);
  }
  @Get('/image/:imgpath')
  @Header('Cache-Control', 'max-age=31536000')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    this.logger.verbose(
      `Get on ${image}`,
    );
    return res.sendFile(image, { root: './files' });
  }
}
