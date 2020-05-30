import { IsNotEmpty } from 'class-validator';

export class EditPictoDto {
  @IsNotEmpty()
  speech: string;

  @IsNotEmpty()
  meaning: string;

  @IsNotEmpty()
  folder: number;

  @IsNotEmpty()
  fatherId: number;
}
