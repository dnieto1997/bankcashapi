import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CashOutRequestsService } from './cash-out-requests.service';
import { CreateCashOutRequestDto } from './dto/create-cash-out-request.dto';
import { UpdateCashOutRequestDto } from './dto/update-cash-out-request.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRols } from 'src/users/enums/user-rol.enum';

@Auth(UserRols.ADMIN)
@Controller('cash-out-requests')
export class CashOutRequestsController {
  constructor(
    private readonly cashOutRequestsService: CashOutRequestsService,
  ) {}

  @Post()
  create(
    @Body() createCashOutRequestDto: CreateCashOutRequestDto,
    @GetUser() user: User,
  ) {
    return this.cashOutRequestsService.create(createCashOutRequestDto, user);
  }

  @Get()
  findAll() {
    return this.cashOutRequestsService.findAll();
  }

  @Get('status')
  GetStatus() {
    return this.cashOutRequestsService.getStatus;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cashOutRequestsService.findOne(+id);
  }

  @Auth(UserRols.SUPERADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCashOutRequestDto: UpdateCashOutRequestDto,
  ) {
    return this.cashOutRequestsService.update(id, updateCashOutRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cashOutRequestsService.remove(+id);
  }
}
