import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';
import { LoginAuthDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStatus } from 'src/users/enums';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto, fileName: string) {
    const user = await this.userService.create(createUserDto, fileName);
    const { password, role, ...userResponse } = user;

    return {
      ...userResponse,
      rolId: role.idUserRole,
      token: this.getJwt({
        idUserRole: user.role.idUserRole,
        numDocument: user.numDocument,
      }),
    };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;

    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      // console.log('no se encontro usuario');
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.status === UserStatus.INACTIVE) {
      throw new BadRequestException('Inactive user, talk to administrator');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      // console.log('no se encontro usuario con la contraseña');
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: __, role, ...userResponse } = user;
    return {
      ...userResponse,
      rolId: role.idUserRole,
      token: this.getJwt({
        idUserRole: user.role.idUserRole,
        numDocument: user.numDocument,
      }),
    };
  }

  async checkAuthStatus(user: User) {
    try {
      const { password: __, role, ...userResponse } = user;
      return {
        ...userResponse,
        rolId: role.idUserRole,
        token: this.getJwt({
          idUserRole: user.role.idUserRole,
          numDocument: user.numDocument,
        }),
      };
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  private getJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDbErrors(error: any) {
    if (error.status == 401) {
      throw new BadRequestException('Invalid Credentials');
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Check server logs');
  }
}
