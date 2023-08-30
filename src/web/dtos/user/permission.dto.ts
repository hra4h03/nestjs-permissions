import { PermissionEnum } from 'src/core/aggregates/user/permission/permission';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetPermissionDto {
  @Expose()
  @ApiProperty({ type: Number })
  public id: number;

  @Expose()
  @ApiProperty({ enum: PermissionEnum })
  public name: PermissionEnum;
}
