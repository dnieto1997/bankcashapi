import { Module } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { NotifyController } from './notify.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notify } from './entities/notify.entity';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { AccountModule } from 'src/account/account.module';
import { UsersModule } from 'src/users/users.module';
import { CountryModule } from 'src/country/country.module';

@Module({
  controllers: [NotifyController],
  providers: [NotifyService],
  imports: [
    TypeOrmModule.forFeature([Notify]),
    TransactionsModule,
    AccountModule,
    UsersModule,
    CountryModule,
  ],
})
export class NotifyModule {}
