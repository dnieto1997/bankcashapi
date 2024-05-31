import { Module } from '@nestjs/common';
import { CashOutRequestsService } from './cash-out-requests.service';
import { CashOutRequestsController } from './cash-out-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashOutRequests } from './entities/cash-out-request.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { CountryModule } from 'src/country/country.module';

@Module({
  controllers: [CashOutRequestsController],
  providers: [CashOutRequestsService],
  imports: [
    TypeOrmModule.forFeature([CashOutRequests]),
    CommonModule,
    AuthModule,
    TransactionsModule,
    CountryModule,
  ],
  exports: [TypeOrmModule],
})
export class CashOutRequestsModule {}
