import { Injectable, Logger } from '@nestjs/common';
import { Key2payAuthService } from '../services/key2pay-auth.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class Key2payAuthCron {
  private readonly logger = new Logger(Key2payAuthCron.name);

  constructor(private readonly key2payAuthService: Key2payAuthService) {}

  @Cron('0 0 * * * *')
  async handleCron() {
    if (!this.key2payAuthService.isTokenValid()) {
      await this.key2payAuthService.getToken();
    }
  }
}
