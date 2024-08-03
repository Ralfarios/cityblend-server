import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { EXCEPTION_PRISMA_CODE } from 'src/common/consts/exception.const';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = [EXCEPTION_PRISMA_CODE.DEFAULT];
    let error = 'Internal Server Error';

    if (exception.code === 'P2002') {
      status = HttpStatus.BAD_REQUEST;
      message = (exception.meta?.target as string[])?.map(
        (name) => EXCEPTION_PRISMA_CODE.P2002 + name,
      );
      error = 'Bad Request';
    }
    if (exception.code === 'P2025') {
      status = HttpStatus.NOT_FOUND;
      message = [
        EXCEPTION_PRISMA_CODE.P2025 +
          exception.message?.split(' ')?.[1]?.toLowerCase(),
      ];
      error = 'Not Found';
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
    });
  }
}
