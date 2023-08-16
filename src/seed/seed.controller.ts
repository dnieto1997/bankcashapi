import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  runSedd() {
    return this.seedService.executeSedd();
  }
}
