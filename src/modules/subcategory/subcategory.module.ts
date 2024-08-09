import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { SubcategoryController } from './subcategory.controller';
import { SubcategoryService } from './subcategory.service';

@Module({
  imports: [DbModule],
  controllers: [SubcategoryController],
  providers: [SubcategoryService],
})
export class SubcategoryModule {}
