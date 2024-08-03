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
import { ColorService } from './color.service';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { CreateColorDto } from './dto/create-color.dto';
import { PaginationColorQueryDto } from './dto/pagination-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { SwapOrderColorDto } from './dto/swap-order-color.dto';

@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  create(@Body() createColorDto: CreateColorDto) {
    return this.colorService.create(createColorDto);
  }

  @Get()
  findAll(@Query() query: PaginationColorQueryDto) {
    return this.colorService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.colorService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(NoFilesInterceptor())
  update(@Param('id') id: string, @Body() updateColorDto: UpdateColorDto) {
    return this.colorService.update(id, updateColorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colorService.remove(id);
  }

  @Patch(':id/swap')
  @UseInterceptors(NoFilesInterceptor())
  swapOrder(
    @Param('id') id: string,
    @Body() swapOrderColorDto: SwapOrderColorDto,
  ) {
    return this.colorService.swapOrder(id, swapOrderColorDto);
  }
}
