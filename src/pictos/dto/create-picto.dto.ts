import { IsNotEmpty } from 'class-validator';

export class CreatePictoDto {
  @IsNotEmpty()
  speech: string;

  @IsNotEmpty()
  meaning: string;

  @IsNotEmpty()
  folder: boolean;

  @IsNotEmpty()
  fatherId: number;
}
