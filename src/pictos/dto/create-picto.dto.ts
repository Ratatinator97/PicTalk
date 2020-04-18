import { IsNotEmpty } from 'class-validator';

export class CreatePictoDto {
  @IsNotEmpty()
  speech: string;

  @IsNotEmpty()
  meaning: string;

  @IsNotEmpty()
  folder: number;

  @IsNotEmpty()
  fatherId: number;
}
