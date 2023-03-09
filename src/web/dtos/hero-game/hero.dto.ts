import { ApiProperty } from '@nestjs/swagger';
import { GetDragonDto } from './dragon.dto';
import { Expose, Type } from 'class-transformer';

export class GetHeroResponseDto {
  @ApiProperty({ type: Number })
  @Expose()
  public id: number;

  @ApiProperty({ type: String })
  @Expose()
  public name: string;

  @ApiProperty({ type: Number })
  @Expose()
  public skill: number;

  @ApiProperty({ type: () => GetDragonDto, isArray: true })
  @Type(() => GetDragonDto)
  @Expose()
  public killedDragons: GetDragonDto[];
}

export class GetMinHeroResponseDto {
  @ApiProperty({ type: Number })
  @Expose()
  public id: number;

  @ApiProperty({ type: String })
  @Expose()
  public name: string;

  @ApiProperty({ type: Number })
  @Expose()
  public skill: number;
}
