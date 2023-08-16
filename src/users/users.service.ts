import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from 'src/auth/dto';
import { User } from './entities/user.entity';
import { UserRol } from './enums';
import { Account } from 'src/account/entities/account.entity';
import { AccountRols } from 'src/account/enums';
import { UserChangePasswordDto } from './dto/user-change-password.dto';
import * as bcrypt from 'bcrypt';
import { CountryService } from 'src/country/country.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    private readonly countryService: CountryService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const country = await this.countryService.findOne(createUserDto.country);
    try {
      const usuario = this.userRepository.create({
        ...createUserDto,
        country,
        role: {
          idUserRole: UserRol.CLIENT,
        },
        account: this.accountRepository.create({
          numberOfAccount: createUserDto.cellphone,
          accountBalance: {
            balance: '0',
            currencyCode: `${country.curencyCode}`,
          },
          accountRols: [
            {
              idAccountRole: AccountRols.SEE,
            },
            {
              idAccountRole: AccountRols.MANAGMENT,
            },
            {
              idAccountRole: AccountRols.TRANSACTION,
            },
          ],
        }),
      });
      await this.userRepository.save(usuario);
      return usuario;
    } catch (error) {
      this.handleError(error);
    }
  }

  findAll(user: User) {
    return user;
  }

  findOne(id: number) {
    return `This action updates a #${id} user`;
  }

  async findOneByEmail(email: string) {
    try {
      // const queryBuilder = this.userRepository.createQueryBuilder('users');
      // const user = queryBuilder
      //   .where('cellphone =:cellphone or num_document =:numDocument', {
      //     cellphone,
      //     numDocument,
      //   })
      //   .leftJoinAndSelect('users.role', 'user_rol')
      //   .getOne();

      const user = await this.userRepository.findOneBy({ email });

      return user;
    } catch (error) {
      this.handleError(error);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async changePassword(
    userChangePasswordDto: UserChangePasswordDto,
    user: User,
  ) {
    const { currentPassword, newPassword } = userChangePasswordDto;

    try {
      if (!bcrypt.compareSync(currentPassword, user.password)) {
        throw new UnauthorizedException();
      }

      const toUpdate = await this.userRepository.preload({
        idUser: user.idUser,
        password: newPassword,
      });

      await this.userRepository.save(toUpdate);
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error.errno === 1062) {
      throw new BadRequestException('Ya existe un usuario');
    }

    if (error.status === 401) {
      throw new BadRequestException('Invalid Current password');
    }
    console.log(error);
    this.logger.error(error);
    throw new InternalServerErrorException('Check server logs');
  }
}
