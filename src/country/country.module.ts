import { Module, forwardRef } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Country } from './entities';
import { AuthModule } from 'src/auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { CommonModule } from 'src/common/common.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Country,
  Currency,
  MehtodsPayout,
  Regions,
  Banks,
  DocuemntsAllowed,
  TypeAccountAllowed,
} from './entities';

@Module({
  controllers: [CountryController],
  providers: [CountryService],
  imports: [
    TypeOrmModule.forFeature([
      Currency,
      Country,
      Banks,
      MehtodsPayout,
      Regions,
      DocuemntsAllowed,
      TypeAccountAllowed,
    ]),
    HttpModule,
    ConfigModule,
    forwardRef(() => AuthModule),
    CommonModule,
  ],
  exports: [CountryService, TypeOrmModule],
})
export class CountryModule {}
