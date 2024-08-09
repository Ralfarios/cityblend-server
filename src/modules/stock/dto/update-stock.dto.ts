import { PartialType } from '@nestjs/mapped-types';
import { StockDto } from './stock.dto';

export class UpdateStockDto extends PartialType(StockDto) {}
