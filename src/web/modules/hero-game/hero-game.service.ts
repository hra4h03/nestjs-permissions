import { Result } from '@/common/primitives/Result';
import { DragonAlreadyDeadError } from '@/core/errors/DragonAlreadyDead.error';
import { NotFoundError } from '@/core/errors/NotFound.error';
import { Dragon } from '@aggregates/dragon/dragon.aggregate';
import { Hero } from '@aggregates/hero/hero.aggregate';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { from, map, mergeMap } from 'rxjs';
import { DatabaseResponseMetrics } from 'src/web/common/metrics/DatabaseReponseTime.metrics';
import { KafkaService } from 'src/web/common/services/kafka.service';
import { RedisSortedSetService } from 'src/web/common/services/redis-sorted-set.service';
import { CreateDragon } from 'src/web/dtos/hero-game/dragon/create.dragon';

@Injectable()
export class HeroGameService {
  constructor(
    private readonly redisSortedSetService: RedisSortedSetService,
    private readonly kafkaService: KafkaService,
    private readonly em: EntityManager,
  ) {}

  @DatabaseResponseMetrics()
  public getDragons() {
    const dragonSet = this.em.getRepository(Dragon);
    return from(
      dragonSet.findAll({
        fields: ['name', 'status', 'killedBy.name', 'killedBy.skill'],
        // populate: ['killedBy.skill', 'killedBy.name'],
      }),
    );
  }

  public getHeroes() {
    const heroSet = this.em.getRepository(Hero);
    return from(heroSet.findAll({ populate: ['killedDragons'] }));
  }

  public getTopNRanked(n = 5) {
    const redis = this.redisSortedSetService.get();
    const heroes = redis.zrevrange('hero:leaderboard', 0, n - 1);

    return from(heroes).pipe(
      map((heroIds) => heroIds.map((h) => Number(h.split(':').at(-1)))),
      mergeMap((heroIds) => {
        const heroSet = this.em.getRepository(Hero);
        return from(
          heroSet.find(
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

  public async killDragon(
    heroId: number,
    dragonId: number,
  ): Promise<Result<boolean, DragonAlreadyDeadError | NotFoundError>> {
    // const redis = this.redisSortedSetService.get();
    const heroSet = this.em.getRepository(Hero);
    const dragonSet = this.em.getRepository(Dragon);

    const hero = await heroSet.findOne(heroId);
    const dragon = await dragonSet.findOne(dragonId);

    const result = await hero.killDragon(dragon);

    if (result.isFailure) return result;
    // mergeMap(async ([hero, dragon]) => {
    // return zip(
    // from(redis.zadd('hero:leaderboard', hero.skill, `hero:${heroId}`)),
    // from(this.entityManager.flush()),
    // );
    // }),
    // tap(async () => await this.publishDragonKilledEvent(heroId, dragonId)),
    // map(() => true),
    // );

    await this.em.flush();

    return Result.ok(true);
  }

  public createDragon(createDragonDto: CreateDragon.Dto) {
    const dragon = Dragon.born(createDragonDto.name);
    return from(this.em.persistAndFlush(dragon)).pipe(map(() => dragon));
  }

  private async publishDragonKilledEvent(heroId: number, dragonId: number) {
    const producer = this.kafkaService.getProducer();
    await producer.send({
      topic: 'hero-game',
      messages: [{ value: new Uint16Array([heroId, dragonId]).toString() }],
    });
  }
}
