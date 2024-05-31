import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { AccountModule } from './account/account.module';
import { TransactionsModule } from './transactions/transactions.module';
import { DigitalCardModule } from './products/digital-card/digital-card.module';
import { CountryModule } from './country/country.module';
import { NotifyModule } from './notify/notify.module';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { LandingPageModule } from './landing-page/landing-page.module';
import { CashOutRequestsModule } from './cash-out-requests/cash-out-requests.module';
import { FilesModule } from './files/files.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    AuthModule,
    UsersModule,
    CommonModule,
    SeedModule,
    AccountModule,
    TransactionsModule,
    DigitalCardModule,
    CountryModule,
    NotifyModule,
    LandingPageModule,
    CashOutRequestsModule,
    FilesModule,
  ],
})
export class AppModule {}
