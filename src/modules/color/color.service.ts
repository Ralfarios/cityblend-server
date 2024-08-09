import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { PaginationColorQueryDto } from './dto/pagination-color.dto';
import { DEFAULT_PAGINATION_VALUE } from 'src/common/consts/pagination.const';
import {
  CommonResponseDto,
  PaginateResponseDto,
} from 'src/common/dto/response.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { DbService } from '../db/db.service';
import { UpdateColorDto } from './dto/update-color.dto';
import { SwapOrderColorDto } from './dto/swap-order-color.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ColorService {
  constructor(private readonly db: DbService) {}

  async create(createColorDto: CreateColorDto) {
    try {
      const count = await this.db.color.count();
      const payload = createColorDto as CreateColorDto & {
        display_order: number;
      };

      if (!payload.display_order) payload.display_order = count + 1;

      const data = await this.db.color.create({
        data: payload,
      });

      return new CommonResponseDto({
        statusCode: HttpStatus.CREATED,
        data,
        error: null,
        message: 'New color has been created',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) throw error;
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(query: PaginationColorQueryDto) {
    const limit = query?.limit || DEFAULT_PAGINATION_VALUE.LIMIT;
    const offset = query?.offset || DEFAULT_PAGINATION_VALUE.OFFSET;
    const orderBy = query?.order_by || 'created_at';
    const orderSort = query?.order_sort || 'asc';
    const search = query.search;

    const where: Prisma.ColorWhereInput = {
      name: { contains: search, mode: 'insensitive' },
    };

    try {
      const [count, records] = await this.db.$transaction([
        this.db.color.count({ where }),
        this.db.color.findMany({
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
        message: 'Colors has been fetched',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) throw error;
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.db.color.findFirstOrThrow({ where: { id } });

      return new CommonResponseDto({
        statusCode: HttpStatus.OK,
        data,
        error: null,
        message: 'Color has been fetched',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) throw error;
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateColorDto: UpdateColorDto) {
    try {
      const data = await this.db.color.update({
        where: { id },
        data: updateColorDto,
      });

      return new CommonResponseDto({
        statusCode: HttpStatus.OK,
        data,
        error: null,
        message: 'Color has been edited',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') error.message = 'No Color found';
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      const currDelete = await this.db.color.delete({
        where: { id },
      });

      await this.db.color.updateMany({
        where: { display_order: { gt: currDelete.display_order } },
        data: { display_order: { decrement: 1 } },
      });

      return new CommonResponseDto({
        statusCode: HttpStatus.OK,
        data: null,
        error: null,
        message: 'Color has been deleted',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') error.message = 'No Color found';
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async swapOrder(id: string, swapOrderColorDto: SwapOrderColorDto) {
    const displayOrder = swapOrderColorDto.display_order;

    try {
      const data = await this.db.$transaction(async (prisma) => {
        const curr = await prisma.color.findFirstOrThrow({
          where: { id },
          select: { display_order: true },
        });

        await prisma.color.update({
          where: { display_order: displayOrder },
          data: { display_order: -1 },
        });

        const result = await prisma.color.update({
          where: { id },
          data: { display_order: displayOrder },
        });

        await prisma.color.update({
          where: { display_order: -1 },
          data: { display_order: curr.display_order },
        });

        return result;
      });

      return new CommonResponseDto({
        statusCode: HttpStatus.OK,
        data,
        error: null,
        message: "Color's display order has been swapped",
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') error.message = 'No Color found';
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
