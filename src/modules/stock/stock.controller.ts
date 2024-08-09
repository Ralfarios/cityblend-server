import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { CreateStockDto } from './dto/create-stock.dto';
import { PaginationStockQueryDto } from './dto/pagination-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }

  @Get()
  findAll(@Query() query: PaginationStockQueryDto) {
    return this.stockService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(NoFilesInterceptor())
  update(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
    return this.stockService.update(id, updateStockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockService.remove(id);
  }
}
