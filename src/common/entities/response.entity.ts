import { ApiProperty } from '@nestjs/swagger';

export class CommonResponseEntity {
  @ApiProperty({ type: 'string', nullable: true })
  message: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  error: string | null;

  @ApiProperty({ type: 'number' })
  statusCode: number;

  @ApiProperty({ nullable: true })
  data: unknown | null;
}
