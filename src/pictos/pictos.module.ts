import { forwardRef, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PictosController } from './pictos.controller';
import { PictoService } from './pictos.service';
import { CollectionService } from './collection.service';
import { CollectionRepository } from './collection.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PictoRepository } from './picto.repository';
import { AuthModule } from 'src/auth/auth.module';
import { NoDuplicatasService } from './noDuplicatas.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './files',
    }),
    TypeOrmModule.forFeature([CollectionRepository]),
    TypeOrmModule.forFeature([PictoRepository]),
    forwardRef(() => AuthModule),
  ],
  controllers: [PictosController],
  providers: [PictoService, CollectionService, NoDuplicatasService],
})
export class PictosModule {}
