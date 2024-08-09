import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/query.dto';

enum ColorOrderBy {
  CREATED_AT = 'created_at',
  NAME = 'name',
  CODE = 'code',
  PRICE = 'price',
}

enum OrderSort {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationProductQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  readonly search?: string;

  @IsOptional()
  @IsEnum(OrderSort)
  readonly order_sort?: OrderSort;

  @IsOptional()
  @IsEnum(ColorOrderBy)
  order_by?: ColorOrderBy;

  @IsOptional()
  @IsString()
  subcategory_id?: string;
}
