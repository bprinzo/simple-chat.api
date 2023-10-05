import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
async function bootstrap() {
  console.log(process.env.API_SERVER_PORT);

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  await app.listen(process.env.API_SERVER_PORT || 3333);

  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
