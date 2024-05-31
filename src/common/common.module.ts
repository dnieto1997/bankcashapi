import { Module } from '@nestjs/common';
import { Key2payAuthService } from './services/key2pay-auth.service';
import { Key2payAuthInterceptor } from './interceptor/key2pay-auth.interceptor';
import { Key2payAuthCron } from './cron-jobs/key2pay-auth.cron';
import { HttpModule } from '@nestjs/axios';
import { ToppayService } from './services/toppay.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [
    Key2payAuthService,
    Key2payAuthInterceptor,
    Key2payAuthCron,
    ToppayService,
  ],
  imports: [HttpModule, ConfigModule],
  exports: [
    Key2payAuthService,
    Key2payAuthInterceptor,
    Key2payAuthCron,
    ToppayService,
  ],
})
export class CommonModule {}
