import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetAuditableDto {
  @Expose()
  @ApiProperty({ type: String })
  public createdAt: string;

  @ApiProperty({ type: String })
  @Expose()
  public updatedAt: string;
}
