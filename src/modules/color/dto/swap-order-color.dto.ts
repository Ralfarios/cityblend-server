import { IsInt } from 'class-validator';
import { EXCEPTION_FIELD_CODE } from 'src/common/consts/exception.const';

export class SwapOrderColorDto {
  @IsInt({
    message: ({ property }) => EXCEPTION_FIELD_CODE.TYPE.NUMBER + property,
  })
  display_order: number;
}
