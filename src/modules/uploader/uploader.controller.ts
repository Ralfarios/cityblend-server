import {
  BadRequestException,
  Controller,
  Delete,
  HttpStatus,
  InternalServerErrorException,
  ParseArrayPipe,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFiles,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  EXCEPTION_SUPABASE_CODE,
  EXCEPTION_UPLOAD_CODE,
} from 'src/common/consts/exception.const';
import { FileTypeValidator } from './validator/file-type.validator';
import { UploaderService } from './uploader.service';
import { SupabaseExceptionFilter } from 'src/exceptions/supabase.exception';

@Controller('uploader')
export class UploaderController {
  constructor(private readonly uploaderService: UploaderService) {}

  @Post('/product-image')
  @UseInterceptors(FilesInterceptor('files'))
  @UseFilters(SupabaseExceptionFilter)
  createProductImage(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addValidator(
          new FileTypeValidator({
            fileType: ['image/jpeg', 'image/png', 'image/webp'],
          }),
        )
        .addMaxSizeValidator({
          maxSize: 50 * 1024 * 1024,
          message: (maxSize) => EXCEPTION_UPLOAD_CODE.MAX_SIZE + maxSize,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: true,
        }),
    )
    files: Array<Express.Multer.File>,
  ) {
    return this.uploaderService.createProductImage(files);
  }

  @Delete('/product-image')
  @UseFilters(SupabaseExceptionFilter)
  removeProductImage(
    @Query(
      'paths',
      new ParseArrayPipe({
        items: String,
        separator: ',',
        exceptionFactory: (error) => {
          let message = EXCEPTION_SUPABASE_CODE.DEFAULT;

          if (error === 'Validation failed (parsable array expected)') {
            message = EXCEPTION_SUPABASE_CODE.REQUIRED_PATH;
            return new BadRequestException(message);
          }

          return new InternalServerErrorException(message);
        },
      }),
    )
    paths: string[],
  ) {
    return this.uploaderService.removeProductImage(paths);
  }
}
