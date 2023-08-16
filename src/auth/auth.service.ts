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

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    const { password, role, ...userResponse } = user;

    return {
      ...userResponse,
      rolId: role.idUserRole,
      token: this.getJwt({ numDocument: user.numDocument }),
    };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;

    try {
      const user = await this.userService.findOneByEmail(email);

      if (!user) {
        throw new UnauthorizedException();
      }

      if (!bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException();
      }

      const { password: __, role, ...userResponse } = user;
      return {
        ...userResponse,
        rolId: role.idUserRole,
        token: this.getJwt({ numDocument: user.numDocument }),
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
