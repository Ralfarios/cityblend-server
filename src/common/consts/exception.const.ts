export const EXCEPTION_PRISMA_CODE = {
  P2002: 'unique_constraint.field.',
  P2025: 'not_found.db.',
  DEFAULT: 'database_error',
};

export const EXCEPTION_FIELD_CODE = {
  REQUIRED: 'required.field.',
  MIN: 'min_char.field.',
  MAX: 'max_char.field.',
  LENGTH: 'length.field.',
  MATCHES: 'allowed_char.field.',
  EMAIL: 'invalid_email.field.',
  TYPE: {
    STRING: 'type.string.field.',
    NUMBER: 'type.number.field.',
    BOOLEAN: 'type.boolean.field.',
  },
};
