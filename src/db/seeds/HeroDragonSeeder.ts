import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { HeroFactory } from '@/db/factories/hero.factory';
import { DragonFactory } from '@/db/factories/dragon.factory';
import { zip } from 'lodash';

export class HeroDragonSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const heroes = await new HeroFactory(em).create(5);
    const dragons = await new DragonFactory(em).create(5);

    for (const [hero, dragon] of zip(heroes, dragons)) {
      await hero.killDragon(dragon);
    }

    new DragonFactory(em).make(10);
    await new HeroFactory(em).create(1_000_000);
  }
}
