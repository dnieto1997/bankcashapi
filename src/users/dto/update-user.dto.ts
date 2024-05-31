import { PartialType } from '@nestjs/mapped-types';
// import { IsEnum } from 'class-validator';
// import { UserStatus } from '../enums';
import { CreateUserDto } from 'src/auth/dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // @IsEnum(UserStatus)
  // status: UserStatus;
}
