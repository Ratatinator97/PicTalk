import { IsNotEmpty } from 'class-validator';

export class CreateCollectionDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  color: string;
}
