import { Module } from '@nestjs/common';
import { SizeService } from './size.service';
import { SizeController } from './size.controller';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [SizeController],
  providers: [SizeService],
})
export class SizeModule {}
