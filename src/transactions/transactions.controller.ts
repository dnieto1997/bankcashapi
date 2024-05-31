import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { TransactionsService } from './transactions.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserRols } from 'src/users/enums/user-rol.enum';
import { User } from 'src/users/entities/user.entity';
import { CreatePay } from './dto/create-paying.dto';
import { CreateKey2Pay } from './dto/create-key2pay-pay.dto';

@ApiTags('Transactions')
@ApiBearerAuth()
@Auth(UserRols.CLIENT, UserRols.ADMIN, UserRols.SUPERADMIN)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // @Post('key2pay-paying')
  // createKey2PayPaying(
  //   @Body() createTransactionDto: CreateKey2Pay,
  //   @GetUser() user: User,
  // ) {
  //   return this.transactionsService.createkey2payPaying(
  //     createTransactionDto,
  //     user,
  //   );
  // }

  // @Post('key2pay-collection')
  // createKey2PayCollection(
  //   @Body() createTransactionDto: CreateKey2Pay,
  //   @GetUser() user: User,
  // ) {
  //   return this.transactionsService.createCollection(
  //     createTransactionDto,
  //     user,
  //   );
  // }

  @Get()
  findTransactions(@GetUser() user: User) {
    return this.transactionsService.findAll(user);
  }

  @Get('of-the-admin/:idUser')
  findTransactionsOfAdmin(@Param('idUser', ParseIntPipe) idUser: number) {
    return this.transactionsService.findAllOfAdmin(idUser);
  }

  @Post('paying')
  createToppayPaying(
    @Body() createToppayPaying: CreatePay,
    @GetUser() user: User,
  ) {
    return this.transactionsService.createPaying(createToppayPaying, user);
  }

  @Post('collection')
  createKey2PayCollection(
    @Body() createTransactionDto: CreateKey2Pay,
    @GetUser() user: User,
  ) {
    return this.transactionsService.createCollection(
      createTransactionDto,
      user,
    );
  }
}
