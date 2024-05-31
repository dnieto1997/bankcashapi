import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './entities/transaction.entity';
import { AuthModule } from 'src/auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { CommonModule } from 'src/common/common.module';
import { UsersModule } from 'src/users/users.module';
import { CountryModule } from 'src/country/country.module';
import { ConfigModule } from '@nestjs/config';
import { TransactionsPayoutService } from './transactions-payout.service';
import { TypeTransaction } from './entities/type-transaction.entity';
import { Taxes } from './entities/taxes.entity';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsPayoutService],
  imports: [
    ConfigModule,
    HttpModule,
    TypeOrmModule.forFeature([Transaction, TypeTransaction, Taxes]),
    AuthModule,
    CommonModule,
    UsersModule,
    CountryModule,
    AuthModule,
  ],
  exports: [TypeOrmModule, TransactionsPayoutService],
})
export class TransactionsModule {}
