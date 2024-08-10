export const EXCEPTION_PRISMA_CODE = {
  P2002: 'unique_constraint.field.',
  P2025: 'not_found.db.',
  DEFAULT: 'database_error',
};

export const EXCEPTION_FIELD_CODE = {
  REQUIRED: 'required.field.',
  ARRAY_NOT_EMPTY: 'required_array.field.',
  MIN: 'min_char.field.',
  MAX: 'max_char.field.',
  LENGTH: 'length.field.',
  MATCHES: 'allowed_char.field.',
  EMAIL: 'invalid_email.field.',
  TYPE: {
    STRING: 'type.string.field.',
    NUMBER: 'type.number.field.',
    BOOLEAN: 'type.boolean.field.',
    ARRAY: 'type.array.field.',
  },
};

export const EXCEPTION_UPLOAD_CODE = {
  MAX_SIZE: 'max_size.file.',
  EXT_NOT_ALLOWED: 'ext_not_allowed.file.',
};

export const EXCEPTION_SUPABASE_CODE = {
  DEFAULT: 'database_error',
  INVALID_MIME_TYPE: 'invalid_extension.format.',
  NOT_FOUND_BUCKET: 'not_found.bucket',
  REQUIRED_PATH: 'required.params.paths',
};
