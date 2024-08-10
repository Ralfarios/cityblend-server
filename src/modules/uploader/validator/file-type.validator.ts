import { Injectable, FileValidator } from '@nestjs/common';
import * as fileType from 'file-type-mime';
import { EXCEPTION_UPLOAD_CODE } from 'src/common/consts/exception.const';

interface FileTypeValidatorOptions {
  fileType: string[];
}

@Injectable()
export class FileTypeValidator extends FileValidator {
  private allowedMimeTypes: string[];

  constructor(readonly validationOptions: FileTypeValidatorOptions) {
    super(validationOptions);
    this.allowedMimeTypes = this.validationOptions.fileType;
  }

  buildErrorMessage(): string {
    return `${EXCEPTION_UPLOAD_CODE.EXT_NOT_ALLOWED}${this.allowedMimeTypes.join('-')}`;
  }

  isValid(file?: Express.Multer.File): boolean {
    if (!file?.buffer) return false;

    const response = fileType.parse(file.buffer);

    if (!response?.mime) return false;

    return this.allowedMimeTypes.includes(response.mime);
  }
}
