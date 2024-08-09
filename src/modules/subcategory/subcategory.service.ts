import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  CommonResponseDto,
  PaginateResponseDto,
} from 'src/common/dto/response.dto';
import { PaginationSubcategoryQueryDto } from './dto/pagination-subcategory.dto';
import { DEFAULT_PAGINATION_VALUE } from 'src/common/consts/pagination.const';
import { Prisma } from '@prisma/client';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { SwapOrderSubcategoryDto } from './dto/swap-order-subcategory.dto';

@Injectable()
export class SubcategoryService {
  constructor(private readonly db: DbService) {}

  async create(createSubcategoryDto: CreateSubcategoryDto) {
    try {
      await this.db.category.findFirstOrThrow({
        where: { id: createSubcategoryDto.category_id },
      });

      const count = await this.db.subcategory.count({
        where: { category_id: createSubcategoryDto.category_id },
      });
      const payload = createSubcategoryDto as CreateSubcategoryDto & {
        display_order: number;
      };

      if (!payload.display_order) payload.display_order = count + 1;

      const data = await this.db.subcategory.create({ data: payload });

      return new CommonResponseDto({
        statusCode: HttpStatus.CREATED,
        data,
        error: null,
        message: 'New subcategory has been created',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') error.message = 'No Category found';
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(query: PaginationSubcategoryQueryDto) {
    const limit = query?.limit || DEFAULT_PAGINATION_VALUE.LIMIT;
    const offset = query?.offset || DEFAULT_PAGINATION_VALUE.OFFSET;
    const orderBy = query?.order_by || 'created_at';
    const orderSort = query?.order_sort || 'asc';
    const search = query.search;
    const category_id = query.category_id;

    const where: Prisma.SubcategoryWhereInput = {
      name: { contains: search, mode: 'insensitive' },
      ...(category_id && { category_id }),
    };

    try {
      const [count, records] = await this.db.$transaction([
        this.db.subcategory.count({ where }),
        this.db.subcategory.findMany({
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
        message: 'Subcategories has been fetched',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) throw error;
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.db.subcategory.findFirstOrThrow({
        where: { id },
        include: {
          products: {
            select: {
              id: true,
              name: true,
              price: true,
              product_images: { select: { id: true, image_url: true } },
              code: true,
              stocks: {
                select: {
                  id: true,
                  code: true,
                  stock_quantity: true,
                  discount_percent: true,
                  color: {
                    select: {
                      id: true,
                      name: true,
                      code: true,
                      color_code: true,
                    },
                  },
                  size: {
                    select: {
                      id: true,
                      name: true,
                      code: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return new CommonResponseDto({
        statusCode: HttpStatus.OK,
        data,
        error: null,
        message: 'Subcategory has been fetched',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) throw error;
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateSubcategoryDto: UpdateSubcategoryDto) {
    try {
      await this.db.category.findFirstOrThrow({
        where: { id: updateSubcategoryDto.category_id },
      });

      const data = await this.db.subcategory.update({
        where: { id },
        data: updateSubcategoryDto,
      });

      return new CommonResponseDto({
        statusCode: HttpStatus.OK,
        data,
        error: null,
        message: 'Subcategory has been edited',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025' && error.meta?.modelName === 'Subcategory')
          error.message = 'No Subcategory found';
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      const currDelete = await this.db.subcategory.delete({
        where: { id },
      });

      await this.db.subcategory.updateMany({
        where: { display_order: { gt: currDelete.display_order } },
        data: { display_order: { decrement: 1 } },
      });

      return new CommonResponseDto({
        statusCode: HttpStatus.OK,
        data: null,
        error: null,
        message: 'Subcategory has been deleted',
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') error.message = 'No Subcategory found';
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async swapOrder(
    id: string,
    swapOrderSubcategoryDto: SwapOrderSubcategoryDto,
  ) {
    const displayOrder = swapOrderSubcategoryDto.display_order;

    try {
      const data = await this.db.$transaction(async (prisma) => {
        const curr = await prisma.subcategory.findFirstOrThrow({
          where: { id },
          select: { display_order: true, category_id: true },
        });

        const categoryId = curr.category_id;

        const target = await prisma.subcategory.findMany({
          where: { display_order: displayOrder, category_id: categoryId },
        });

        if (target.length === 0) {
          throw new Prisma.PrismaClientKnownRequestError(
            'No Subcategory found',
            {
              code: 'P2025',
              clientVersion: '',
            },
          );
        }

        const targetData = target[0];

        await prisma.subcategory.update({
          where: { id: targetData.id, category_id: categoryId },
          data: { display_order: -1 },
        });

        const result = await prisma.subcategory.update({
          where: { id, category_id: categoryId },
          data: { display_order: displayOrder },
        });

        await prisma.subcategory.update({
          where: { id: targetData.id, category_id: categoryId },
          data: { display_order: curr.display_order },
        });

        return result;
      });

      return new CommonResponseDto({
        statusCode: HttpStatus.OK,
        data,
        error: null,
        message: "Subcategory's display order has been swapped",
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') error.message = 'No Subcategory found';
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
