import { EntityDTO, Loaded } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

import { Dragon } from '@aggregates/dragon/dragon.aggregate';
import { Hero } from '@aggregates/hero/hero.aggregate';
import { GetDragonDto } from './dragon.dto';

export class GetHeroResponseDto {
  @ApiProperty({ type: Number })
  public id: number;

  @ApiProperty({ type: String })
  public name: string;

  @ApiProperty({ type: Number })
  public skill: number;

  @ApiProperty({ type: Dragon, isArray: true })
  public killedDragons: GetDragonDto[];

  constructor(object: EntityDTO<Loaded<Hero, never>>) {
    Object.assign(this, object);
  }
}
