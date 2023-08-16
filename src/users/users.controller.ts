import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

import { CreateUserDto } from 'src/auth/dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { UserChangePasswordDto } from './dto/user-change-password.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRols } from './enums/user-rol.enum';

@ApiTags('Users')
@ApiBearerAuth()
@Auth(UserRols.ADMIN, UserRols.CLIENT)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiExcludeEndpoint()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiExcludeEndpoint()
  @Get()
  @Auth()
  findAll(@GetUser() user: User) {
    return this.usersService.findAll(user);
  }

  @ApiExcludeEndpoint()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @ApiExcludeEndpoint()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @ApiBody({ type: UserChangePasswordDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('change-password')
  changePassword(
    @Body() userChangePasswordDto: UserChangePasswordDto,
    @GetUser() user: User,
  ) {
    return this.usersService.changePassword(userChangePasswordDto, user);
  }

  @ApiExcludeEndpoint()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
