import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { PictosModule } from './pictos/pictos.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), AuthModule, PictosModule],
})
export class AppModule {}
