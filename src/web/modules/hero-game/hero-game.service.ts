import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Dragon } from '@aggregates/dragon/dragon.aggregate';
import { EntityRepository } from '@mikro-orm/postgresql';
import { forkJoin, from, map, mergeMap } from 'rxjs';
import { Hero } from '@aggregates/hero/hero.aggregate';
import { CreateDragon } from '@/web/dtos/hero-game/dragon/create.dragon';

@Injectable()
export class HeroGameService {
  constructor(
    @InjectRepository(Dragon)
    private readonly dragonRepository: EntityRepository<Dragon>,
    @InjectRepository(Hero)
    private readonly heroRepository: EntityRepository<Hero>,
  ) {}

  public getDragons() {
    return from(
      this.dragonRepository.findAll({
        populate: ['killedBy'],
      }),
    );
  }

  public getHeroes() {
    return from(this.heroRepository.findAll({ populate: ['killedDragons'] }));
  }

  public killDragon(heroId: number, dragonId: number) {
    return forkJoin([
      this.heroRepository.findOneOrFail(heroId),
      this.dragonRepository.findOneOrFail(dragonId),
    ]).pipe(
      mergeMap(([hero, dragon]) => {
        hero.killDragon(dragon);
        return from(this.heroRepository.flush());
      }),
      map(() => true),
    );
  }

  public createDragon(createDragonDto: CreateDragon.Dto) {
    const dragon = Dragon.born(createDragonDto.name);
    return from(this.dragonRepository.persistAndFlush(dragon)).pipe(
      map(() => dragon),
    );
  }
}
