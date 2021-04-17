import { IsNotEmpty } from 'class-validator';

export class StarterCollectionDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  color: string;

  @IsNotEmpty()
  path: string;
}
