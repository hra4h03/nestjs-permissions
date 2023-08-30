import { GetAuditableDto } from 'src/web/dtos/common/autitable.dto';
import { GetRoleDto } from 'src/web/dtos/user/role.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class GetUserDto {
  @Expose()
  @ApiProperty({ type: Number })
  public id: number;

  @Expose()
  @ApiProperty({ type: String })
  public name: string;

  @Expose()
  @Type(() => GetRoleDto)
  @ApiProperty({ type: GetRoleDto })
  public role: GetRoleDto;

  @Expose()
  @Type(() => GetAuditableDto)
  @ApiProperty({ type: () => GetAuditableDto })
  public auditable: GetAuditableDto;
}
