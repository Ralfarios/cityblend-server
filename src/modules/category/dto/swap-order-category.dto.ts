import { IsInt } from 'class-validator';
import { EXCEPTION_FIELD_CODE } from 'src/common/consts/exception.const';

export class SwapOrderCategoryDto {
  @IsInt({
    message: ({ property }) => EXCEPTION_FIELD_CODE.TYPE.NUMBER + property,
  })
  display_order: number;
}
