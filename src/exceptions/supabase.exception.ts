import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { EXCEPTION_SUPABASE_CODE } from 'src/common/consts/exception.const';

@Catch()
export class SupabaseExceptionFilter extends BaseExceptionFilter {
  catch(
    exception: { statusCode: string; error: string; message: string },
    host: ArgumentsHost,
  ): void {
    const context = host.switchToHttp();
    const response = context.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = [EXCEPTION_SUPABASE_CODE.DEFAULT];
    let error = 'Internal Server Error';

    if (exception.error === 'Bucket not found') {
      status = HttpStatus.NOT_FOUND;
      message = [EXCEPTION_SUPABASE_CODE.NOT_FOUND_BUCKET];
      error = 'Not Found';
    }
    if (exception.error === 'invalid_mime_type') {
      status = HttpStatus.UNSUPPORTED_MEDIA_TYPE;
      message = [
        EXCEPTION_SUPABASE_CODE.INVALID_MIME_TYPE +
          exception.message?.replace(/mime type | is not supported/g, ''),
      ];
      error = 'Unsupported Media Type';
    }

    if ((exception.message = 'required.params.paths')) {
      status = HttpStatus.BAD_REQUEST;
      message = [exception.message];
      error = 'Bad Request';
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
    });
  }
}
