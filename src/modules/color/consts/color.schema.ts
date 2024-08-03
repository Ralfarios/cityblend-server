import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const colorSchema: SchemaObject | ReferenceObject = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Name for the color',
      example: 'Blue',
    },
    code: {
      type: 'string',
      description: 'Code for the color',
      example: 'col001',
      minLength: 4,
      maxLength: 6,
    },
    color_code: {
      type: 'string',
      description: 'Hex color code for the color',
      example: 'ffffff',
    },
  },
};
