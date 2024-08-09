import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { EXCEPTION_FIELD_CODE } from 'src/common/consts/exception.const';
import { StockDto } from './stock.dto';

export class CreateStockDto {
  @IsArray({
    message: ({ property }) => EXCEPTION_FIELD_CODE.TYPE.ARRAY + property,
  })
  @ArrayNotEmpty({
    message: ({ property }) => EXCEPTION_FIELD_CODE.ARRAY_NOT_EMPTY + property,
  })
  @ValidateNested({ each: true })
  @Type(() => StockDto)
  stocks: StockDto;
}
