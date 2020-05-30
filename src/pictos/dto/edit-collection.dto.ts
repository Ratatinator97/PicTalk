import { IsNotEmpty } from 'class-validator';

export class EditCollectionDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  color: string;
}
