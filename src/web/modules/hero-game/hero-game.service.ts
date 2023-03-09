import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Dragon } from '@aggregates/dragon/dragon.aggregate';
import { EntityRepository } from '@mikro-orm/postgresql';
import { forkJoin, from, map, mergeMap, zip } from 'rxjs';
import { Hero } from '@aggregates/hero/hero.aggregate';
import { CreateDragon } from '@/web/dtos/hero-game/dragon/create.dragon';
import { RedisSortedSetService } from '@/web/common/services/redis-sorted-set.service';

@Injectable()
export class HeroGameService {
  constructor(
    @InjectRepository(Dragon)
    private readonly dragonRepository: EntityRepository<Dragon>,
    @InjectRepository(Hero)
    private readonly heroRepository: EntityRepository<Hero>,
    private readonly redisSortedSetService: RedisSortedSetService,
  ) {}

  public getDragons() {
    return from(
      this.dragonRepository.findAll({
        fields: ['name', 'status', 'killedBy.name', 'killedBy.skill'],
        // populate: ['killedBy.skill', 'killedBy.name'],
      }),
    );
  }

  public getHeroes() {
    return from(this.heroRepository.findAll({ populate: ['killedDragons'] }));
  }

  public getTopNRanked(n = 5) {
    const redis = this.redisSortedSetService.get();
    const heroes = redis.zrevrange('hero:leaderboard', 0, n - 1);

    return from(heroes).pipe(
      map((heroIds) => heroIds.map((h) => Number(h.split(':').at(-1)))),
      mergeMap((heroIds) => {
        return from(
          this.heroRepository.find(
            { id: { $in: heroIds } },
            {
              orderBy: { skill: 'DESC' },
              populate: ['killedDragons'],
              fields: [
                'name',
                'skill',
                'auditable',
                'killedDragons.name',
                'killedDragons.status',
              ],
            },
          ),
        );
      }),
    );
  }

  public killDragon(heroId: number, dragonId: number) {
    const redis = this.redisSortedSetService.get();
    return forkJoin([
      this.heroRepository.findOneOrFail(heroId),
      this.dragonRepository.findOneOrFail(dragonId),
    ]).pipe(
      mergeMap(async ([hero, dragon]) => {
        await hero.killDragon(dragon);
        return zip(
          from(redis.zadd('hero:leaderboard', hero.skill, `hero:${heroId}`)),
          from(this.heroRepository.flush()),
        );
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
