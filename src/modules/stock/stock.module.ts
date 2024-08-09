import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

@Module({
  imports: [DbModule],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
