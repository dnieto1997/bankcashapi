import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Equal, In, Not, Repository } from 'typeorm';
import { format } from 'date-fns';

import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from 'src/auth/dto';
import { User } from './entities/user.entity';
import { UserRol } from './enums';
import { Account } from 'src/account/entities/account.entity';
import { AccountRols } from 'src/account/enums';
import { UserChangePasswordDto } from './dto/user-change-password.dto';
import * as bcrypt from 'bcrypt';
import { CountryService } from 'src/country/country.service';
import { randomInt } from 'src/common/helpers/random-int.helper';
import { CheckExistenceDto } from './dto/check-existence.dto';
import { TypeDocument } from './entities/type-document.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    @InjectRepository(TypeDocument)
    private readonly typeDocumentRepository: Repository<TypeDocument>,

    private readonly countryService: CountryService,
  ) {}

  async create(createUserDto: CreateUserDto, documentFileName?: string) {
    const { country, typeDocument, ...restUserDto } = createUserDto;

    try {
      // const country = await this.countryService.findOne(createUserDto.country);
      const usuario = this.userRepository.create({
        ...restUserDto,
        urlDocument: documentFileName || '',
        country: {
          idCountry: country,
        },
        typeDocument: {
          idTypeDocument: typeDocument,
        },
        role: {
          idUserRole: createUserDto.idUserRole || UserRol.CLIENT,
        },
        account: this.accountRepository.create({
          numberOfAccount: `5${randomInt(0, 9, 9)}`,
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
      return await this.userRepository.findOne({
        relations: {
          role: true,
          account: true,
        },
        select: {
          account: {
            idAccount: true,
            numberOfAccount: true,
            balance: true,
          },
        },
        where: {
          idUser: usuario.idUser,
        },
      });
    } catch (error) {
      console.log(error);
      this.handleError(error);
    }
  }

  async findAllAmdin() {
    try {
      const users = await this.userRepository.find({
        relations: {
          account: true,
        },
        select: {
          idUser: true,
          names: true,
          surnames: true,
          account: {
            idAccount: true,
          },
        },
        where: {
          role: {
            idUserRole: 2,
          },
        },
      });

      return users.map(({ fullName, account, ...restUser }) => ({
        ...restUser,
        fullName,
        targetAccount: account.idAccount,
      }));
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll() {
    try {
      const users = await this.userRepository.find({
        select: {
          idUser: true,
          names: true,
          surnames: true,
          email: true,
          cellphone: true,
          createdAt: true,
          status: true,
        },
        where: {
          idUser: Not(In([1, 2])),
        },
      });

      return users.map((user) => {
        const formattedDate = format(user.createdAt, 'yyyy-MM-dd');

        return { ...user, createdAt: formattedDate };
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async getTypeDocuments() {
    return await this.typeDocumentRepository.find();
  }

  async getUsersAdmin() {
    const users = await this.userRepository.find({
      where: {
        role: {
          idUserRole: Equal(2),
        },
      },
    });

    return users;
  }

  async getAllToSuperAdmin() {
    try {
      const users = await this.userRepository.find({
        relations: {
          country: true,
          role: true,
          typeDocument: true,
        },
        select: {
          idUser: true,
          names: true,
          surnames: true,
          numDocument: true,
          email: true,
          cellphone: true,
          password: true,
          createdAt: true,
          status: true,
          country: {
            idCountry: true,
            countryCode: true,
            countryName: true,
            currencyCode: true,
            currencyName: true,
            flagPng: true,
            flagSvg: true,
          },
          role: {
            idUserRole: true,
            name: true,
          },
        },
        where: {
          role: {
            idUserRole: In([2, 3]),
          },
        },
      });

      return users.map((user) => {
        const formattedDate = format(user.createdAt, 'yyyy-MM-dd');

        return { ...user, createdAt: formattedDate };
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  findOne(id: number) {
    return `This action updates a #${id} user`;
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({
        relations: {
          role: true,
          account: true,
        },
        select: {
          account: {
            idAccount: true,
            numberOfAccount: true,
            balance: true,
          },
        },
        where: {
          email,
        },
      });

      return user;
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(
    id: number,
    { idUserRole, country, typeDocument, ...restUserDto }: UpdateUserDto,
  ) {
    try {
      if (restUserDto.password) {
        restUserDto.password = bcrypt.hashSync(restUserDto.password, 10);
      }

      if (!idUserRole) {
        await this.userRepository.update(id, {
          ...restUserDto,
        });
        return;
      }

      await this.userRepository.update(id, {
        ...restUserDto,
        typeDocument: {
          idTypeDocument: typeDocument,
        },
        country: {
          idCountry: country,
        },
        role: {
          idUserRole,
        },
      });
    } catch (error) {
      this.handleError(error);
    }
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
        throw new BadRequestException('Invalid credentials');
      }

      const toUpdate = await this.userRepository.preload({
        idUser: user.idUser,
        password: bcrypt.hashSync(newPassword, 10),
      });

      await this.userRepository.save(toUpdate);

      return {
        message: 'Password updated successfully',
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async checkExistence({ term }: CheckExistenceDto) {
    try {
      const querybuilder = this.userRepository.createQueryBuilder('user');
      querybuilder.orWhere('num_document =:numDocument', {
        numDocument: term,
      });
      querybuilder.orWhere('email =:email', {
        email: term,
      });
      querybuilder.orWhere('cellphone =:cellphone', {
        cellphone: term,
      });

      const result = await querybuilder.getOne();
      if (!result) {
        return { isUnique: true };
      }

      return { isUnique: false };
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    console.log(error);
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
