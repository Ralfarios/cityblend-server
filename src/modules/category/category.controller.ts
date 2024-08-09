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
import { CategoryService } from './category.service';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PaginationCategoryQueryDto } from './dto/pagination-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SwapOrderCategoryDto } from './dto/swap-order-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query() query: PaginationCategoryQueryDto) {
    return this.categoryService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(NoFilesInterceptor())
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }

  @Patch(':id/swap')
  @UseInterceptors(NoFilesInterceptor())
  swapOrder(
    @Param('id') id: string,
    @Body() swapOrderCategoryDto: SwapOrderCategoryDto,
  ) {
    return this.categoryService.swapOrder(id, swapOrderCategoryDto);
  }
}
