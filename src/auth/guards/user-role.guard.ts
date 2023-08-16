import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected/role-protected.decorator';
import { User } from 'src/users/entities/user.entity';
import { UserStatus } from 'src/users/enums';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: number[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRoles) {
      return true;
    }

    if (validRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new BadRequestException('User inactive');
    }

    if (validRoles.includes(user.role.idUserRole)) {
      return true;
    }

    throw new UnauthorizedException(`User ${user.fullName} need a valid role`);
  }
}
