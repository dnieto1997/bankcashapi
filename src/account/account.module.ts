import { Module, forwardRef } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { AccountRole } from './entities/account-role.entity';
// import { AccountBalance } from './entities/account-balance.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  imports: [
    TypeOrmModule.forFeature([Account, AccountRole]),
    forwardRef(() => AuthModule),
  ],
  exports: [TypeOrmModule],
})
export class AccountModule {}
