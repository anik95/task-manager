import {
  IsByteLength,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ToLowerCase } from '../../utils/transform.js';
import { CreateAuthDto } from './create-auth.dto.js';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  @ToLowerCase()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  rememberMe: boolean = false;
}
