import { ApiProperty } from '@nestjs/swagger';

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { getPasswordRegex } from '../../utils';
export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(255)
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @MinLength(8)
  @MaxLength(32)
  @Matches(getPasswordRegex(), { message: 'password is too weak' })
  password: string;
}
