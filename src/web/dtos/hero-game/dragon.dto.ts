import { ApiProperty } from '@nestjs/swagger';

import { DragonStatus } from '@aggregates/dragon/dragon.aggregate';
import { GetMinHeroResponseDto } from './hero.dto';
import { Expose, Type } from 'class-transformer';

export class GetDragonDto {
  @ApiProperty({ type: Number })
  @Expose()
  public readonly id: number;

  @ApiProperty({ type: String })
  @Expose()
  public readonly name: string;

  @ApiProperty({ enum: DragonStatus })
  @Expose()
  public readonly status: DragonStatus;

  @ApiProperty({ type: () => GetMinHeroResponseDto })
  @Type(() => GetMinHeroResponseDto)
  @Expose()
  public readonly killedBy: GetMinHeroResponseDto;
}
