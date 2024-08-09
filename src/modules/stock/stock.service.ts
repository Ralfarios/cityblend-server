import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { DbService } from '../db/db.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  CommonResponseDto,
  PaginateResponseDto,
} from 'src/common/dto/response.dto';
import { PaginationStockQueryDto } from './dto/pagination-stock.dto';
import { DEFAULT_PAGINATION_VALUE } from 'src/common/consts/pagination.const';
import { Prisma } from '@prisma/client';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class StockService {
  constructor(private readonly db: DbService) {}

  async create(createStockDto: CreateStockDto) {
    try {
      const data = await this.db.productStock.createManyAndReturn({
        data: createStockDto.stocks,
        select: {
          id: true,
          code: true,
          products: { select: { name: true, id: true, code: true } },
          colors: {
            select: { name: true, id: true, code: true, color_code: true },
          },
          sizes: { select: { name: true, id: true, code: true } },
          stock_quantity: true,
          discount_percent: true,
          created_at: true,
          edited_at: true,
        },
      });

      return new CommonResponseDto({
        statusCode: HttpStatus.CREATED,
        data,
        error: null,
        message: 'New stocks has been created',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) throw error;
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(query: PaginationStockQueryDto) {
    const limit = query?.limit || DEFAULT_PAGINATION_VALUE.LIMIT;
    const offset = query?.offset || DEFAULT_PAGINATION_VALUE.OFFSET;
    const orderBy = query?.order_by || 'created_at';
    const orderSort = query?.order_sort || 'asc';
    const color_search = query.color_search;
    const product_search = query.product_search;
    const size_search = query.size_search;

    const where: Prisma.ProductStockWhereInput = {
      colors: { name: { contains: color_search, mode: 'insensitive' } },
      products: { name: { contains: product_search, mode: 'insensitive' } },
      sizes: { name: { contains: size_search, mode: 'insensitive' } },
    };

    try {
      const [count, records] = await this.db.$transaction([
        this.db.productStock.count({ where }),
        this.db.productStock.findMany({
          skip: offset,
          take: limit,
          orderBy: { [orderBy]: orderSort },
          where,
          select: {
            id: true,
            code: true,
            products: { select: { name: true, id: true, code: true } },
            colors: {
              select: { name: true, id: true, code: true, color_code: true },
            },
            sizes: { select: { name: true, id: true, code: true } },
            stock_quantity: true,
            discount_percent: true,
            created_at: true,
            edited_at: true,
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
        message: 'Stocks has been fetched',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) throw error;
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.db.productStock.findFirstOrThrow({
        where: { id },
        select: {
          id: true,
          code: true,
          products: { select: { name: true, id: true, code: true } },
          colors: {
            select: { name: true, id: true, code: true, color_code: true },
          },
          sizes: { select: { name: true, id: true, code: true } },
          stock_quantity: true,
          discount_percent: true,
          created_at: true,
          edited_at: true,
        },
      });

      return new CommonResponseDto({
        statusCode: HttpStatus.OK,
        data,
        error: null,
        message: 'Stock has been fetched',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) throw error;
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateStockDto: UpdateStockDto) {
    try {
      const data = await this.db.$transaction(async (prisma) => {
        await prisma.size.findFirstOrThrow({
          where: { id: updateStockDto.size_id },
        });
        await prisma.color.findFirstOrThrow({
          where: { id: updateStockDto.color_id },
        });
        await prisma.product.findFirstOrThrow({
          where: { id: updateStockDto.product_id },
        });

        return await prisma.productStock.update({
          where: { id },
          data: updateStockDto,
          select: {
            id: true,
            code: true,
            products: { select: { name: true, id: true, code: true } },
            colors: {
              select: { name: true, id: true, code: true, color_code: true },
            },
            sizes: { select: { name: true, id: true, code: true } },
            stock_quantity: true,
            discount_percent: true,
            created_at: true,
            edited_at: true,
          },
        });
      });

      return new CommonResponseDto({
        statusCode: HttpStatus.OK,
        data,
        error: null,
        message: 'Stock has been edited',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        console.log(error);
        if (error.code === 'P2025' && error.meta?.modelName === 'ProductStock')
          error.message = 'No Stock found';
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      await this.db.productStock.delete({
        where: { id },
      });

      return new CommonResponseDto({
        statusCode: HttpStatus.OK,
        data: null,
        error: null,
        message: 'Stock has been deleted',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') error.message = 'No Stock found';
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
