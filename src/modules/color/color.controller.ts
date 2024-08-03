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
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ColorResponseEntity,
  ColorsResponseEntity,
} from './entities/color.entity';
import { colorSchema } from './consts/color.schema';
import { CommonResponseEntity } from 'src/common/entities/response.entity';

@Controller('color')
@ApiTags('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Post()
  @ApiCreatedResponse({ type: ColorResponseEntity })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: colorSchema })
  @UseInterceptors(NoFilesInterceptor())
  create(@Body() createColorDto: CreateColorDto) {
    return this.colorService.create(createColorDto);
  }

  @Get()
  @ApiOkResponse({ type: ColorsResponseEntity })
  findAll(@Query() query: PaginationColorQueryDto) {
    return this.colorService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: ColorResponseEntity })
  findOne(@Param('id') id: string) {
    return this.colorService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: ColorResponseEntity })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: colorSchema })
  @UseInterceptors(NoFilesInterceptor())
  update(@Param('id') id: string, @Body() updateColorDto: UpdateColorDto) {
    return this.colorService.update(id, updateColorDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: CommonResponseEntity })
  remove(@Param('id') id: string) {
    return this.colorService.remove(id);
  }

  @Patch(':id/swap')
  @ApiOkResponse({ type: ColorResponseEntity })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        display_order: {
          type: 'number',
          description: 'Display order number',
          example: 1,
        },
      },
    },
  })
  @UseInterceptors(NoFilesInterceptor())
  swapOrder(
    @Param('id') id: string,
    @Body() swapOrderColorDto: SwapOrderColorDto,
  ) {
    return this.colorService.swapOrder(id, swapOrderColorDto);
  }
}
