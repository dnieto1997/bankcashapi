import { SetMetadata } from '@nestjs/common';
import { UserRol } from 'src/users/enums';

export const META_ROLES = 'rols';

export const RoleProtected = (...args: UserRol[]) =>
  SetMetadata(META_ROLES, args);
