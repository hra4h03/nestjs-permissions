import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Dragon } from '@aggregates/dragon/dragon.aggregate';
import { GetDragonDto } from '@/web/dtos/hero-game/dragon.dto';

@Injectable()
export class DragonProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, Dragon, GetDragonDto);
    };
  }
}
