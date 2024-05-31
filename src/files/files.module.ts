import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [FilesController],
  imports: [ConfigModule, AuthModule],
  providers: [FilesService],
})
export class FilesModule {}
