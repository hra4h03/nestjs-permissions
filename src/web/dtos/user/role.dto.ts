import { Expose, Type } from 'class-transformer';
import { GetPermissionDto } from './permission.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetRoleDto {
  @Expose()
  @ApiProperty({ type: Number })
  public id: number;

  @Expose()
  @ApiProperty({ type: String })
  public name: string;

  @Expose()
  @Type(() => GetPermissionDto)
  @ApiProperty({ type: [GetPermissionDto] })
  public permissions: GetPermissionDto[];
}
