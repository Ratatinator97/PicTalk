import { Module, CacheInterceptor, CacheModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { minioClientConfig } from './config/minio.config';
import { AuthModule } from './auth/auth.module';
import { PictosModule } from './pictos/pictos.module';
import { MinioModule } from 'nestjs-minio-client';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    MinioModule.register(minioClientConfig),
    AuthModule,
    PictosModule,
    CacheModule.register(),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
