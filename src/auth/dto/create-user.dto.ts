import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(254)
  @Matches(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    { message: 'Not a valid email address' },
  )
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @IsString()
  @MinLength(1)
  @MaxLength(40)
  name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(40)
  surname: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(40)
  address: string;

  @IsOptional()
  @IsString()
  @Matches(/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9])$/, {
    message: 'Not a valid age',
  })
  age: string;

  @IsOptional()
  @IsString()
  @Matches(/^(male|female)$/g, { message: 'Gender has wrong values' })
  gender: string;

  @IsOptional()
  @IsString()
  @Matches(
    /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/,
    { message: 'Phone number is not a valid phone number' },
  )
  phone: string;
}
