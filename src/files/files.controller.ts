import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { CreateFileDto } from './dto/create.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Auth()
  @Get('document/:imageName')
  findDocumentImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticDocumentIamge(imageName);
    return res.sendFile(path);
  }

  @Post('document')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './static/document-user',
        filename: fileNamer,
      }),
    }),
  )
  uploadDocumentImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: '.(png|jpg|jpeg)' })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
    @Body() create: CreateFileDto,
  ) {
    const secureUrl = `${this.configService.get(
      'API_URL',
    )}/files/document-user/${file.filename}`;

    return { secureUrl, create };
  }
}
