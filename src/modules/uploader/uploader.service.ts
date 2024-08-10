import { HttpStatus, Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { envConfig } from 'src/common/configs/env.config';
import { CommonResponseDto } from 'src/common/dto/response.dto';
import { supabase } from 'src/lib/supabase/supabase.config';
import { FileNameUtil } from './utils/file-name.util';

@Injectable()
export class UploaderService {
  async createProductImage(files: Array<Express.Multer.File>) {
    try {
      const output: { name: string; image_url: string }[] = [];

      const promises = files.map(async (file) => {
        try {
          const compImgBuffer = await sharp(file.buffer)
            .webp({ quality: 80 })
            .toBuffer();

          const name = `${
            new FileNameUtil(file.originalname).removeExt().normalize().filename
          }_${Date.now()}.webp`;

          const { data, error } = await supabase.storage
            .from('product_image')
            .upload(name, compImgBuffer, {
              cacheControl: '3600',
              contentType: 'image/webp',
            });

          if (error) throw error;

          output.push({
            name,
            image_url: `${envConfig.supabaseUrl}/storage/v1/object/public/product_image/${data.path}`,
          });
        } catch (error) {
          throw error;
        }
      });

      await Promise.all(promises);

      return new CommonResponseDto({
        message: 'New product images has been uploaded',
        statusCode: HttpStatus.CREATED,
        data: output,
        error: null,
      });
    } catch (error) {
      throw error;
    }
  }

  async removeProductImage(paths: string[]) {
    try {
      const imagePaths = paths.map((path) =>
        path.replace(
          `${envConfig.supabaseUrl}/storage/v1/object/public/product_image/`,
          '',
        ),
      );

      const { error } = await supabase.storage
        .from('product_image')
        .remove(imagePaths);

      if (error) throw error;

      return new CommonResponseDto({
        message: 'Product images has been deleted',
        statusCode: HttpStatus.OK,
        data: null,
        error: null,
      });
    } catch (error) {
      throw error;
    }
  }
}
