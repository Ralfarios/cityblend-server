import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { EXCEPTION_FIELD_CODE } from 'src/common/consts/exception.const';

export class CreateProductDto {
  @IsNotEmpty({
    message: ({ property }) => EXCEPTION_FIELD_CODE.REQUIRED + property,
  })
  @IsString({
    message: ({ property }) => EXCEPTION_FIELD_CODE.TYPE.STRING + property,
  })
  name: string;

  @IsString({
    message: ({ property }) => EXCEPTION_FIELD_CODE.TYPE.STRING + property,
  })
  @IsOptional()
  care_instruction?: string;

  @IsNotEmpty({
    message: ({ property }) => EXCEPTION_FIELD_CODE.REQUIRED + property,
  })
  @IsString({
    message: ({ property }) => EXCEPTION_FIELD_CODE.TYPE.STRING + property,
  })
  code: string;

  @IsString({
    message: ({ property }) => EXCEPTION_FIELD_CODE.TYPE.STRING + property,
  })
  @IsOptional()
  description?: string;

  @IsNotEmpty({
    message: ({ property }) => EXCEPTION_FIELD_CODE.REQUIRED + property,
  })
  @IsString({
    message: ({ property }) => EXCEPTION_FIELD_CODE.TYPE.STRING + property,
  })
  subcategory_id: string;

  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: ({ property }) => EXCEPTION_FIELD_CODE.TYPE.NUMBER + property },
  )
  @IsNotEmpty({
    message: ({ property }) => EXCEPTION_FIELD_CODE.REQUIRED + property,
  })
  price: number;
}
