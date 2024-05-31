import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';

@Injectable()
export class FilesService {
  getStaticDocumentIamge(imageName: string) {
    const path = join(__dirname, '../../static/document-user', imageName);

    if (!existsSync(path)) {
      throw new BadRequestException(
        `No document found with image ${imageName}`,
      );
    }

    return path;
  }
}
