import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './entities/transaction.entity';
import { AuthModule } from 'src/auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [HttpModule, TypeOrmModule.forFeature([Transaction]), AuthModule],
})
export class TransactionsModule {}
