import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly limit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  readonly offset?: number;
}
