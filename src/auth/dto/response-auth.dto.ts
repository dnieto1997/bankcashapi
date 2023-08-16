import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

export class ResponseAuthDto extends User {
  @ApiProperty()
  roleId: number;

  @ApiProperty()
  token: string;
}
