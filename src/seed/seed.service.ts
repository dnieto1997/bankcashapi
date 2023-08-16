import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/users/entities/user-role.entity';
import { Repository } from 'typeorm';
import { USER_ROL_SEED } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(UserRole)
    private readonly UserRolRepository: Repository<UserRole>,
  ) {}

  async executeSedd() {
    const seedUserRol = USER_ROL_SEED;

    const userRols: UserRole[] = [];

    seedUserRol.forEach((userRol) => {
      userRols.push(this.UserRolRepository.create(userRol));
    });

    await this.UserRolRepository.save(userRols);
  }
}

// va a ver todo lo que se recaude y aprobar retiro
