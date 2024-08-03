import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Color } from '@prisma/client';
import { CommonResponseEntity } from 'src/common/entities/response.entity';

export class ColorEntity implements Color {
  @ApiProperty({
    description: 'Main ID of color',
  })
  id: string;

  @ApiProperty({ description: 'Name of the color' })
  name: string;

  @ApiProperty({
    description: 'Code for the color',
    example: 'col001',
    minLength: 4,
    maxLength: 6,
  })
  code: string;

  @ApiProperty({
    description: 'Hex color code for the color',
    example: 'ffffff',
  })
  color_code: string;

  @ApiProperty({
    description: 'Display order that shown on the product',
    example: 1,
  })
  display_order: number;

  @ApiProperty()
  created_at: Date;

  @ApiPropertyOptional({
    example: new Date(),
  })
  edited_at: Date | null;
}

export class ColorResponseEntity extends CommonResponseEntity {
  @ApiProperty({
    type: ColorEntity,
    description: 'Data color that has been created/edited/requested',
  })
  data: ColorEntity;
}

export class ColorsResponseEntity extends CommonResponseEntity {
  @ApiProperty({
    type: [ColorEntity],
    isArray: true,
    description: 'Data color that has been created/edited/requested',
    example: [
      {
        id: 'string',
        name: 'string',
        code: 'col001',
        color_code: 'ffffff',
        display_order: 1,
        created_at: '2024-08-03T04:07:31.681Z',
        edited_at: '2024-08-03T04:07:21.408Z',
      },
    ],
  })
  data: ColorEntity[];
}
