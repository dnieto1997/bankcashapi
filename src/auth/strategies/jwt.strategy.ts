import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { User } from 'src/users/entities/user.entity';
import { UserStatus } from 'src/users/enums';

// Esta función extrae el token de las cookies
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
};

// Esta función combina dos extractores
const customExtractor = ExtractJwt.fromExtractors([
  ExtractJwt.fromAuthHeaderAsBearerToken(),
  cookieExtractor,
]);

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET'),
      jwtFromRequest: customExtractor,
    });
  }
  async validate(jwtPayload: JwtPayload) {
    const { numDocument } = jwtPayload;

    const user = await this.userRepository.findOne({
      where: {
        numDocument,
      },
      relations: {
        account: true,
        role: true,
        // country: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid Token');
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException('User inactive');
    }

    return user;
  }
}
