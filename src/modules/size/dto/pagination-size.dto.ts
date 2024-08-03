import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/query.dto';

enum SizeOrderBy {
  CREATED_AT = 'created_at',
  NAME = 'name',
  CODE = 'code',
}

enum OrderSort {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationSizeQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  readonly search?: string;

  @IsOptional()
  @IsEnum(OrderSort)
  readonly order_sort?: OrderSort;

  @IsOptional()
  @IsEnum(SizeOrderBy)
  order_by?: SizeOrderBy;
}
