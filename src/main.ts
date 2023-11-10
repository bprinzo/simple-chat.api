import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
async function bootstrap() {
  console.log(process.env.API_SERVER_PORT);

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const documentConfig = new DocumentBuilder()
    .setTitle('Simple Chat Api')
    .setDescription('The Simple Chat API description')
    .setVersion('1.0')
    .addBearerAuth(undefined, 'defaultBearerAuth')
    .build();

  const document = SwaggerModule.createDocument(app, documentConfig);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.API_SERVER_PORT || 3333);

  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
