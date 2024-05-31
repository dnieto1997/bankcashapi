import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateContactUsDto {
  @IsString()
  @MinLength(3)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  message: string;
}
