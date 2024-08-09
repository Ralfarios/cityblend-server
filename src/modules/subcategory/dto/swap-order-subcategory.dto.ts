import { IsInt } from 'class-validator';
import { EXCEPTION_FIELD_CODE } from 'src/common/consts/exception.const';

export class SwapOrderSubcategoryDto {
  @IsInt({
    message: ({ property }) => EXCEPTION_FIELD_CODE.TYPE.NUMBER + property,
  })
  display_order: number;
}
