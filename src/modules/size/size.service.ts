import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { DbService } from '../db/db.service';
import { PaginationSizeQueryDto } from './dto/pagination-size.dto';
import { DEFAULT_PAGINATION_VALUE } from 'src/common/consts/pagination.const';
import {
  CommonResponseDto,
  PaginateResponseDto,
} from 'src/common/dto/response.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { SwapOrderSizeDto } from './dto/swap-order-size.dto';

@Injectable()
export class SizeService {
  constructor(private readonly db: DbService) {}

  async create(createSizeDto: CreateSizeDto) {
    try {
      const count = await this.db.size.count();
      const payload = createSizeDto as CreateSizeDto & {
        display_order: number;
      };

      if (!payload.display_order) payload.display_order = count + 1;

      const data = await this.db.size.create({
        data: payload,
      });

      return new CommonResponseDto({
        statusCode: HttpStatus.CREATED,
        data,
        error: null,
        message: 'New size has been created',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) throw error;
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(query: PaginationSizeQueryDto) {
    const limit = query?.limit || DEFAULT_PAGINATION_VALUE.LIMIT;
    const offset = query?.offset || DEFAULT_PAGINATION_VALUE.OFFSET;
    const orderBy = query?.order_by || 'created_at';
    const orderSort = query?.order_sort || 'asc';
    const search = query.search;

    try {
      const [count, records] = await this.db.$transaction([
        this.db.size.count(),
        this.db.size.findMany({
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
        message: 'Sizes has been fetched',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) throw error;
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.db.size.findFirstOrThrow({ where: { id } });

      return new CommonResponseDto({
        statusCode: HttpStatus.OK,
        data,
        error: null,
        message: 'Size has been fetched',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) throw error;
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateSizeDto: UpdateSizeDto) {
    try {
      const data = await this.db.size.update({
        where: { id },
        data: updateSizeDto,
      });

      return new CommonResponseDto({
        statusCode: HttpStatus.OK,
        data,
        error: null,
        message: 'Size has been edited',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') error.message = 'No Size found';
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      await this.db.size.delete({
        where: { id },
      });

      return new CommonResponseDto({
        statusCode: HttpStatus.OK,
        data: null,
        error: null,
        message: 'Size has been deleted',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') error.message = 'No Size found';
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async swapOrder(id: string, swapOrderSizeDto: SwapOrderSizeDto) {
    try {
      const displayOrder = swapOrderSizeDto.display_order;

      const curr = await this.db.size.findFirstOrThrow({
        where: { id },
        select: { display_order: true },
      });

      await this.db.size.update({
        where: { display_order: displayOrder },
        data: { display_order: -1 },
      });

      const data = await this.db.size.update({
        where: { id },
        data: { display_order: displayOrder },
      });

      await this.db.size.update({
        where: { display_order: -1 },
        data: { display_order: curr.display_order },
      });

      return new CommonResponseDto({
        statusCode: HttpStatus.OK,
        data,
        error: null,
        message: "Size's display order has been swapped",
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') error.message = 'No Size found';
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
