import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/query.dto';

enum SubcategoryOrderBy {
  CREATED_AT = 'created_at',
  NAME = 'name',
  CODE = 'code',
}

enum OrderSort {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationSubcategoryQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  readonly search?: string;

  @IsOptional()
  @IsEnum(OrderSort)
  readonly order_sort?: OrderSort;

  @IsOptional()
  @IsEnum(SubcategoryOrderBy)
  order_by?: SubcategoryOrderBy;

  @IsOptional()
  @IsString()
  category_id?: string;
}
