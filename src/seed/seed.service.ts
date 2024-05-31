import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/users/entities/user-role.entity';
import { Repository } from 'typeorm';
import {
  ACCOUNT_ROLE_SEED,
  COUNTRIES_SEED,
  // COUNTRIES_SEED,
  USERS_SEED,
  USER_ROL_SEED,
} from './data/seed-data';
// import { Country } from 'src/country/entities';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AccountRole } from 'src/account/entities/account-role.entity';
import { Country } from 'src/country/entities';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserRole)
    private readonly UserRolRepository: Repository<UserRole>,

    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,

    @InjectRepository(AccountRole)
    private readonly accountRoleRepository: Repository<AccountRole>,

    private readonly userService: UsersService,
  ) {}

  async executeSedd() {
    // await this.disableForeignKey();
    // await this.deleteTables();
    await this.insertUserRole();
    await this.insertAccountRole();
    await this.insertCountries();
    await this.insertUsers();
    await this.activarForeignKey();
  }

  async disableForeignKey(): Promise<void> {
    await this.userRepository.query(
      'ALTER TABLE users NOCHECK CONSTRAINT fk_users_role',
    );
  }

  async activarForeignKey(): Promise<void> {
    await this.userRepository.query(
      'ALTER TABLE users CHECK CONSTRAINT fk_users_role',
    );
  }

  async deleteTables() {
    await this.userRepository.clear();

    await this.UserRolRepository.clear();

    await this.countryRepository.clear();
  }

  async insertUserRole() {
    const seedUserRol = USER_ROL_SEED;

    const userRols: UserRole[] = [];

    seedUserRol.forEach((userRol) => {
      userRols.push(this.UserRolRepository.create(userRol));
    });

    await this.UserRolRepository.save(userRols);
  }

  async insertCountries() {
    const seedCountries = COUNTRIES_SEED;

    const countries: Country[] = [];

    seedCountries.forEach((country) =>
      countries.push(this.countryRepository.create(country)),
    );

    await this.countryRepository.save(countries);
  }

  async insertUsers() {
    const seedUsers = USERS_SEED;

    const users: User[] = [];

    seedUsers.forEach((user) => {
      users.push(this.userRepository.create(user));
    });

    await this.userRepository.save(users);
  }

  async insertAccountRole() {
    const seedAccountRole = ACCOUNT_ROLE_SEED;

    const accountRols: AccountRole[] = [];

    seedAccountRole.forEach((accountRole) => {
      accountRols.push(this.accountRoleRepository.create(accountRole));
    });

    await this.accountRoleRepository.save(accountRols);
  }
}
