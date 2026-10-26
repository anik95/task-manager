import {
  IsByteLength,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ToLowerCase } from '../../utils/transform.js';

export class CreateAuthDto {
  @IsEmail()
  @IsNotEmpty()
  @ToLowerCase()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @IsByteLength(1, 72, {
    message: 'Password is too long.',
  }) //has to be between 1 and 72 bytes (not charecters) long, ex. for english 1 char may be 1 byte, but for other languages it may be more than 1 byte
  @Matches(/[a-z]/, { message: 'At least 1 lowercase letter.' })
  @Matches(/[A-Z]/, { message: 'At least 1 uppercase letter.' })
  @Matches(/\d/, { message: 'At least 1 number.' })
  password: string;
}
