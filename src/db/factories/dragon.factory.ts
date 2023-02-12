import { Factory, Faker } from '@mikro-orm/seeder';

import { Dragon, DragonStatus } from '@aggregates/dragon/dragon.aggregate';
import { Auditable } from '@/core/primitives/base.entity';

export class DragonFactory extends Factory<Dragon> {
  public model = Dragon;

  public definition(faker: Faker): Partial<Dragon> {
    return {
      name: faker.animal.crocodilia(),
      status: DragonStatus.ALIVE,
      auditable: new Auditable({
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      }),
    };
  }
}
