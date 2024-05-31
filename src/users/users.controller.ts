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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

import { CreateUserDto } from 'src/auth/dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { UserChangePasswordDto } from './dto/user-change-password.dto';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { CheckExistenceDto } from './dto/check-existence.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiExcludeEndpoint()
  @Auth()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('check-existence')
  checkExistence(@Body() checkExist: CheckExistenceDto) {
    return this.usersService.checkExistence(checkExist);
  }

  @ApiExcludeEndpoint()
  @Get()
  @Auth()
  findAll() {
    return this.usersService.findAll();
  }

  @Auth()
  @Get('find-all-admin')
  findAllAdmin() {
    return this.usersService.findAllAmdin();
  }

  @Auth()
  @Get('find-all-to-superadmin')
  getAllTosuperAdmin() {
    return this.usersService.getAllToSuperAdmin();
  }

  @Get('type-documents')
  getTypeDocuments() {
    return this.usersService.getTypeDocuments();
  }

  @ApiExcludeEndpoint()
  @Auth()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @ApiExcludeEndpoint()
  @Auth()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  // @ApiResponse({ status: HttpStatus.NO_CONTENT })
  // @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  // @ApiBody({ type: UserChangePasswordDto })
  // @HttpCode(HttpStatus.NO_CONTENT)
  @Auth()
  @Put('change-password')
  changePassword(
    @Body() userChangePasswordDto: UserChangePasswordDto,
    @GetUser() user: User,
  ) {
    return this.usersService.changePassword(userChangePasswordDto, user);
  }

  @ApiExcludeEndpoint()
  @Auth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
