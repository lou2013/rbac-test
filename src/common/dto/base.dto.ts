import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BaseDto {
  @Expose({ toPlainOnly: true })
  @ApiProperty({ readOnly: true })
  id: string;

  @Expose({ toPlainOnly: true })
  @ApiProperty({ readOnly: true })
  createdAt: Date;

  @Expose({ toPlainOnly: true })
  @ApiProperty({ readOnly: true })
  updatedAt: Date;

  constructor(data: Partial<BaseDto>) {
    Object.assign(this, data);
  }
}
