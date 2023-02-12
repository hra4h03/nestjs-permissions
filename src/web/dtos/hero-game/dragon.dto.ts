import { ApiProperty } from '@nestjs/swagger';

import { DragonStatus } from '@aggregates/dragon/dragon.aggregate';
import { GetHeroResponseDto } from './hero.dto';

export class GetDragonDto {
  @ApiProperty({ type: Number })
  public readonly id: number;

  @ApiProperty({ type: String })
  public readonly name: string;

  @ApiProperty({ enum: DragonStatus })
  public readonly status: DragonStatus;

  @ApiProperty({ type: GetHeroResponseDto })
  public readonly killedBy: GetHeroResponseDto;
}
