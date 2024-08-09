import { IsNotEmpty, IsString, Length, MinLength } from 'class-validator';
import { EXCEPTION_FIELD_CODE } from 'src/common/consts/exception.const';

export class CreateCategoryDto {
  @IsNotEmpty({
    message: ({ property }) => EXCEPTION_FIELD_CODE.REQUIRED + property,
  })
  @IsString({
    message: ({ property }) => EXCEPTION_FIELD_CODE.TYPE.STRING + property,
  })
  @MinLength(2, {
    message: ({ constraints, property }) =>
      EXCEPTION_FIELD_CODE.MIN + property + `.${constraints}`,
  })
  name: string;

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
