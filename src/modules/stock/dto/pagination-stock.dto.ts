import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/query.dto';

enum StockOrderBy {
  CREATED_AT = 'created_at',
  STOCK_QUANTITY = 'stock_quantity',
  DISCOUNT_PERCENT = 'discount_percent',
  CODE = 'code',
}

enum OrderSort {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationStockQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(OrderSort)
  readonly order_sort?: OrderSort;

  @IsOptional()
  @IsEnum(StockOrderBy)
  readonly order_by?: StockOrderBy;

  @IsOptional()
  @IsString()
  readonly product_search?: string;

  @IsOptional()
  @IsString()
  readonly color_search?: string;

  @IsOptional()
  @IsString()
  readonly size_search?: string;
}
