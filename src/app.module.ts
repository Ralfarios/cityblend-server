import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ColorModule } from './modules/color/color.module';
import { SizeModule } from './modules/size/size.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [ColorModule, SizeModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
