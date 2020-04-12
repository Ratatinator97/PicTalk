import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PictoRepository } from './picto.repository';
import { User } from 'src/auth/user.entity';
import { Picto } from './picto.entity';
import { CreatePictoDto } from './dto/create-picto.dto';

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
    if (!found) {
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
}
