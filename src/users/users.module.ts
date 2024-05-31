import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserRole } from './entities/user-role.entity';
import { AccountModule } from 'src/account/account.module';
import { CountryModule } from 'src/country/country.module';
import { TypeDocument } from './entities/type-document.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User, UserRole, TypeDocument]),
    forwardRef(() => AuthModule),
    AccountModule,
    CountryModule,
  ],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
