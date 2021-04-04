import { IsNotEmpty } from 'class-validator';

export class StarterPictoDto {
  @IsNotEmpty()
  speech: string;

  @IsNotEmpty()
  meaning: string;

  @IsNotEmpty()
  folder: number;

  @IsNotEmpty()
  fatherMeaning: string;

  @IsNotEmpty()
  path: string;

  @IsNotEmpty()
  collectionName: string;
}
