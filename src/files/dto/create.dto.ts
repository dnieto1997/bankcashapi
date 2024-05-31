import { IsString, MinLength } from 'class-validator';

export class CreateFileDto {
  @IsString()
  @MinLength(1)
  name: string;
}
