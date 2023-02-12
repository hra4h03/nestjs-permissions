import { ApiProperty } from '@nestjs/swagger';

import { GetDragonDto } from './dragon.dto';
import { GetHeroResponseDto } from './hero.dto';

export class KillDragonResponseDto {
  @ApiProperty({ type: GetDragonDto })
  public dragon: GetDragonDto;

  @ApiProperty({ type: GetHeroResponseDto })
  public hero: GetHeroResponseDto;

  constructor(object: KillDragonResponseDto) {
    Object.assign(this, object);
  }
}
