import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  type INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { validationPipeOptions } from './common/consts/validation.const';
import { PrismaExceptionFilter } from './exceptions/prisma.exception';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './common/configs/swagger.config';

function registerGlobals(app: INestApplication) {
  app.useGlobalFilters(new PrismaExceptionFilter());

  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
}

function apiDocs(app: INestApplication) {
  const docs = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, docs);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  registerGlobals(app);
  apiDocs(app);

  await app.listen(3000);
}

bootstrap();
