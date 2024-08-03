import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/query.dto';

enum ColorOrderBy {
  CREATED_AT = 'created_at',
  NAME = 'name',
  CODE = 'code',
}

enum OrderSort {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationColorQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  readonly search?: string;

  @IsOptional()
  @IsEnum(OrderSort)
  readonly order_sort?: OrderSort;

  @IsOptional()
  @IsEnum(ColorOrderBy)
  order_by?: ColorOrderBy;
}
