import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginAuthDto } from './dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseAuthDto } from './dto/response-auth.dto';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileNamer } from '../files/helpers/fileNamer.helper';
import { diskStorage } from 'multer';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Post('register')
  @UseInterceptors(
    FileInterceptor('documentFile', {
      storage: diskStorage({
        destination: './static/document-user',
        filename: fileNamer,
      }),
    }),
  )
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User was created',
    type: ResponseAuthDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User already exists',
  })
  register(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: '.(png|jpg|jpeg)' })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    documentFile: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.authService.create(createUserDto, documentFile.filename);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Correct session start',
    type: ResponseAuthDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid Credentials',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  loginUser(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }
}
