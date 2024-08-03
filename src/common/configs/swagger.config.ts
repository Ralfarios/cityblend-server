import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('CityBlend API')
  .setDescription('The API documentation for CityBlend application')
  .setVersion('1.0')
  .build();
