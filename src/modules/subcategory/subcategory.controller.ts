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
import { SubcategoryService } from './subcategory.service';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { PaginationSubcategoryQueryDto } from './dto/pagination-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { SwapOrderSubcategoryDto } from './dto/swap-order-subcategory.dto';

@Controller('subcategory')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  create(@Body() createSubCategoryDto: CreateSubcategoryDto) {
    return this.subcategoryService.create(createSubCategoryDto);
  }

  @Get()
  findAll(@Query() query: PaginationSubcategoryQueryDto) {
    return this.subcategoryService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subcategoryService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(NoFilesInterceptor())
  update(
    @Param('id') id: string,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    return this.subcategoryService.update(id, updateSubcategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subcategoryService.remove(id);
  }

  @Patch(':id/swap')
  @UseInterceptors(NoFilesInterceptor())
  swapOrder(
    @Param('id') id: string,
    @Body() swapOrderSubcategoryDto: SwapOrderSubcategoryDto,
  ) {
    return this.subcategoryService.swapOrder(id, swapOrderSubcategoryDto);
  }
}
