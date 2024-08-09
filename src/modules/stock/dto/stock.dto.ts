import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { EXCEPTION_FIELD_CODE } from 'src/common/consts/exception.const';

export class StockDto {
  @IsNotEmpty({
    message: ({ property }) => EXCEPTION_FIELD_CODE.REQUIRED + property,
  })
  @IsString({
    message: ({ property }) => EXCEPTION_FIELD_CODE.TYPE.STRING + property,
  })
  product_id: string;

  @IsNotEmpty({
    message: ({ property }) => EXCEPTION_FIELD_CODE.REQUIRED + property,
  })
  @IsString({
    message: ({ property }) => EXCEPTION_FIELD_CODE.TYPE.STRING + property,
  })
  color_id: string;

  @IsNotEmpty({
    message: ({ property }) => EXCEPTION_FIELD_CODE.REQUIRED + property,
  })
  @IsString({
    message: ({ property }) => EXCEPTION_FIELD_CODE.TYPE.STRING + property,
  })
  size_id: string;

  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: ({ property }) => EXCEPTION_FIELD_CODE.TYPE.NUMBER + property },
  )
  @IsNotEmpty({
    message: ({ property }) => EXCEPTION_FIELD_CODE.REQUIRED + property,
  })
  @Min(0, { message: ({ property }) => EXCEPTION_FIELD_CODE.MIN + property })
  stock_quantity: number;

  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: ({ property }) => EXCEPTION_FIELD_CODE.TYPE.NUMBER + property },
  )
  @IsOptional()
  @Min(0, { message: ({ property }) => EXCEPTION_FIELD_CODE.MIN + property })
  discount_percent?: number;

  @IsNotEmpty({
    message: ({ property }) => EXCEPTION_FIELD_CODE.REQUIRED + property,
  })
  @IsString({
    message: ({ property }) => EXCEPTION_FIELD_CODE.TYPE.STRING + property,
  })
  @Length(4, 6, {
    message: ({ property, constraints }) =>
      EXCEPTION_FIELD_CODE.LENGTH + property + `.${constraints}`,
  })
  code: string;
}
