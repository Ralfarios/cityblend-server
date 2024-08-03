import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { SizeService } from './size.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { PaginationSizeQueryDto } from './dto/pagination-size.dto';
import { SwapOrderSizeDto } from './dto/swap-order-size.dto';

@Controller('size')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  create(@Body() createSizeDto: CreateSizeDto) {
    return this.sizeService.create(createSizeDto);
  }

  @Get()
  findAll(@Query() query: PaginationSizeQueryDto) {
    return this.sizeService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sizeService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(NoFilesInterceptor())
  update(@Param('id') id: string, @Body() updateSizeDto: UpdateSizeDto) {
    return this.sizeService.update(id, updateSizeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sizeService.remove(id);
  }

  @Patch(':id/swap')
  @UseInterceptors(NoFilesInterceptor())
  swapOrder(
    @Param('id') id: string,
    @Body() swapOrderSizeDto: SwapOrderSizeDto,
  ) {
    return this.sizeService.swapOrder(id, swapOrderSizeDto);
  }
}
