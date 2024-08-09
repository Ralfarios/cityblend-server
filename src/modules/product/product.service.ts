import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateProductDto } from './dto/create-product.dto';
import {
  CommonResponseDto,
  PaginateResponseDto,
} from 'src/common/dto/response.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PaginationProductQueryDto } from './dto/pagination-product.dto';
import { Prisma } from '@prisma/client';
import { DEFAULT_PAGINATION_VALUE } from 'src/common/consts/pagination.const';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly db: DbService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const data = await this.db.product.create({
        data: createProductDto,
      });

      return new CommonResponseDto({
        statusCode: HttpStatus.CREATED,
        data,
        error: null,
        message: 'New product has been created',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) throw error;
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(query: PaginationProductQueryDto) {
    const limit = query?.limit || DEFAULT_PAGINATION_VALUE.LIMIT;
    const offset = query?.offset || DEFAULT_PAGINATION_VALUE.OFFSET;
    const orderBy = query?.order_by || 'created_at';
    const orderSort = query?.order_sort || 'asc';
    const search = query.search;
    const subcategory_id = query.subcategory_id;

    const where: Prisma.ProductWhereInput = {
      name: { contains: search, mode: 'insensitive' },
      ...(subcategory_id && { subcategory_id }),
    };

    try {
      const [count, records] = await this.db.$transaction([
        this.db.product.count({ where }),
        this.db.product.findMany({
          skip: offset,
          take: limit,
          orderBy: { [orderBy]: orderSort },
          where,
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
        message: 'Products has been fetched',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) throw error;
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.db.product.findFirstOrThrow({ where: { id } });

      return new CommonResponseDto({
        statusCode: HttpStatus.OK,
        data,
        error: null,
        message: 'Product has been fetched',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) throw error;
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const data = await this.db.product.update({
        where: { id },
        data: updateProductDto,
      });

      return new CommonResponseDto({
        statusCode: HttpStatus.OK,
        data,
        error: null,
        message: 'Product has been edited',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') error.message = 'No Product found';
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      await this.db.product.delete({
        where: { id },
      });

      return new CommonResponseDto({
        statusCode: HttpStatus.OK,
        data: null,
        error: null,
        message: 'Product has been deleted',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') error.message = 'No Product found';
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
