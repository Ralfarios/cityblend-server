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
import { Prisma } from '@prisma/client';

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

    const where: Prisma.CategoryWhereInput = {
      name: { contains: search, mode: 'insensitive' },
    };

    try {
      const [count, records] = await this.db.$transaction([
        this.db.category.count({ where }),
        this.db.category.findMany({
          skip: offset,
          take: limit,
          orderBy: { [orderBy]: orderSort },
          where,
          include: {
            subcategory: {
              select: { id: true, name: true, code: true, display_order: true },
              orderBy: { display_order: 'asc' },
            },
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
      const data = await this.db.category.findFirstOrThrow({
        where: { id },
        include: {
          subcategory: {
            select: { id: true, name: true, code: true, display_order: true },
          },
        },
      });

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
      const currDelete = await this.db.category.delete({
        where: { id },
      });

      await this.db.category.updateMany({
        where: { display_order: { gt: currDelete.display_order } },
        data: { display_order: { decrement: 1 } },
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
    const displayOrder = swapOrderCategoryDto.display_order;

    try {
      const data = await this.db.$transaction(async (prisma) => {
        const curr = await prisma.category.findFirstOrThrow({
          where: { id },
          select: { display_order: true },
        });

        await prisma.category.update({
          where: { display_order: displayOrder },
          data: { display_order: -1 },
        });

        const result = await prisma.category.update({
          where: { id },
          data: { display_order: displayOrder },
        });

        await prisma.category.update({
          where: { display_order: -1 },
          data: { display_order: curr.display_order },
        });

        return result;
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
