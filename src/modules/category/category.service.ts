import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  CommonResponseDto,
  PaginateResponseDto,
} from 'src/common/dto/response.dto';
import { DEFAULT_PAGINATION_VALUE } from 'src/common/consts/pagination.const';
import { PaginationCategoryQueryDto } from './dto/pagination-category.dto';
import { SwapOrderCategoryDto } from './dto/swap-order-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly db: DbService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const count = await this.db.category.count();
      const payload = createCategoryDto as CreateCategoryDto & {
        display_order: number;
      };

      if (!payload.display_order) payload.display_order = count + 1;

      const data = await this.db.category.create({
        data: payload,
      });

      return new CommonResponseDto({
        statusCode: HttpStatus.CREATED,
        data,
        error: null,
        message: 'New category has been created',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) throw error;
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(query: PaginationCategoryQueryDto) {
    const limit = query?.limit || DEFAULT_PAGINATION_VALUE.LIMIT;
    const offset = query?.offset || DEFAULT_PAGINATION_VALUE.OFFSET;
    const orderBy = query?.order_by || 'created_at';
    const orderSort = query?.order_sort || 'asc';
    const search = query.search;

    try {
      const [count, records] = await this.db.$transaction([
        this.db.category.count(),
        this.db.category.findMany({
          skip: offset,
          take: limit,
          orderBy: { [orderBy]: orderSort },
          where: {
            name: { contains: search, mode: 'insensitive' },
          },
        }),
      ]);

      return new PaginateResponseDto({
        statusCode: HttpStatus.OK,
        data: {
          count,
          limit,
          offset,
          records,
        },
        error: null,
        message: 'Categories has been fetched',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) throw error;
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.db.category.findFirstOrThrow({ where: { id } });

      return new CommonResponseDto({
        statusCode: HttpStatus.OK,
        data,
        error: null,
        message: 'Category has been fetched',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) throw error;
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const data = await this.db.category.update({
        where: { id },
        data: updateCategoryDto,
      });

      return new CommonResponseDto({
        statusCode: HttpStatus.OK,
        data,
        error: null,
        message: 'Category has been edited',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') error.message = 'No Category found';
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      await this.db.category.delete({
        where: { id },
      });

      return new CommonResponseDto({
        statusCode: HttpStatus.OK,
        data: null,
        error: null,
        message: 'Category has been deleted',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') error.message = 'No Category found';
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async swapOrder(id: string, swapOrderCategoryDto: SwapOrderCategoryDto) {
    try {
      const displayOrder = swapOrderCategoryDto.display_order;

      const curr = await this.db.category.findFirstOrThrow({
        where: { id },
        select: { display_order: true },
      });

      await this.db.category.update({
        where: { display_order: displayOrder },
        data: { display_order: -1 },
      });

      const data = await this.db.category.update({
        where: { id },
        data: { display_order: displayOrder },
      });

      await this.db.category.update({
        where: { display_order: -1 },
        data: { display_order: curr.display_order },
      });

      return new CommonResponseDto({
        statusCode: HttpStatus.OK,
        data,
        error: null,
        message: "Category's display order has been swapped",
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') error.message = 'No Category found';
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
