import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { UsersModule } from 'src/users/users.module';
import { CountryModule } from 'src/country/country.module';
import { AccountModule } from 'src/account/account.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [UsersModule, CountryModule, AccountModule],
})
export class SeedModule {}
