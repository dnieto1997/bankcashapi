import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UserChangePasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  currentPassword: string;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  newPassword: string;
}
