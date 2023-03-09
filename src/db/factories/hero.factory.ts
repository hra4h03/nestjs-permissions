import { Factory, Faker } from '@mikro-orm/seeder';

import { Hero } from '@aggregates/hero/hero.aggregate';
import { Auditable } from '@/core/primitives/base.entity';

export class HeroFactory extends Factory<Hero> {
  public model = Hero;

  public definition(faker: Faker): Partial<Hero> {
    return {
      name: `${faker.name.firstName()} ${faker.name.lastName()} ${Math.random().toString()}`,
      skill: Number(faker.random.numeric(2)),
      auditable: new Auditable({
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      }),
    };
  }
}
