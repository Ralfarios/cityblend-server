import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './modules/db/db.module';
import { ColorModule } from './modules/color/color.module';

@Module({
  imports: [DbModule, ColorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
