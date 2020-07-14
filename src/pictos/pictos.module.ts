import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PictosController } from './pictos.controller';
import { PictoService } from './pictos.service';
import { CollectionService } from './collection.service';
import { CollectionRepository } from './collection.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PictoRepository } from './picto.repository';
import { AuthModule } from 'src/auth/auth.module';
import { minioClientConfig } from '../config/minio.config';
import { MinioModule } from 'nestjs-minio-client';

@Module({
  imports: [
    MulterModule.register({
      dest: './files',
    }),
    MinioModule.register(minioClientConfig),
    TypeOrmModule.forFeature([CollectionRepository]),
    TypeOrmModule.forFeature([PictoRepository]),
    AuthModule,
  ],
  controllers: [PictosController],
  providers: [PictoService, CollectionService],
})
export class PictosModule {}
