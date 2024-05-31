import { IsString, MinLength } from 'class-validator';

export class CheckExistenceDto {
  @IsString()
  @MinLength(1)
  term: string;
}
