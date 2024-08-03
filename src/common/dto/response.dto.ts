import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

type CommonResponseType<T> = {
  message?: string | null;
  error?: string | null;
  statusCode: number;
  data?: T | null;
};

type PaginateResponseDataType<T> = {
  count: number;
  limit: number;
  offset: number;
  records: CommonResponseType<T>['data'];
};

export class CommonResponseDto<T> {
  @IsString()
  @IsOptional()
  message?: string | null;

  @IsString()
  @IsOptional()
  error?: string | null;

  @IsNumber()
  statusCode: number;

  @IsObject()
  @IsOptional()
  data?: T | null;

  constructor({ message, error, statusCode, data }: CommonResponseType<T>) {
    this.data = data;
    this.error = error;
    this.message = message;
    this.statusCode = statusCode;
  }
}

export class PaginateResponseDto<T> extends CommonResponseDto<
  PaginateResponseDataType<T>
> {
  constructor(props: CommonResponseType<PaginateResponseDataType<T>>) {
    super(props);
    this.data = props.data;
  }
}
