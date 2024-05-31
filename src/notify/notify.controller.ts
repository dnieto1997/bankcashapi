import { Controller, Post, Body } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { CreateKey2payNotifyDto } from './dto/create-notify.dto';
import { CreateNotifyTopppay } from './dto/create-notify-toppay.dto';
import { CreateNotifyKey2payPayoutResponseDTO } from './dto/create-notify-key2pay-payout-response.dto';

@Controller('notify')
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}

  @Post('response-key2pay-paying')
  createResponseKey2payPaying(@Body() createNotifyDto: CreateKey2payNotifyDto) {
    return this.notifyService.createResponsekey2pay(createNotifyDto);
  }

  @Post('response-key2pay-collection')
  createResponseKey2payCollection(
    @Body() createNotifyDto: CreateKey2payNotifyDto,
  ) {
    return this.notifyService.createResponsekey2Collection(createNotifyDto);
  }

  @Post('response-key2pay-payout')
  createResponseKey2payPayout(
    @Body() createNotifyDto: CreateNotifyKey2payPayoutResponseDTO,
  ) {
    return this.notifyService.createResponsekey2Payout(createNotifyDto);
  }

  @Post('response-toppay')
  createResponseToppay(@Body() createNotifyTopppay: CreateNotifyTopppay) {
    return this.notifyService.defineResponseOfToppay(createNotifyTopppay);
  }
}
