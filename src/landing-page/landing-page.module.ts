import { Module } from '@nestjs/common';
import { ContactUsModule } from './contact-us/contact-us.module';

@Module({
  imports: [ContactUsModule]
})
export class LandingPageModule {}
