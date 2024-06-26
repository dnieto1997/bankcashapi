import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: '*',
  });
  // app.enableCors({
  //   origin: [
  //     'https://worldpayinternational.com',
  //     'https://production.toppaylatam.com',
  //     'https://api.key2pay.online',
  //   ],
  // });
  // const config = new DocumentBuilder()
  //   .setTitle('Bankcash')
  //   .setDescription('This is the Bankcash API Rest documentation')
  //   .setVersion('1.0')
  //   .addBearerAuth()
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
