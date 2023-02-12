import { Factory, Faker } from '@mikro-orm/seeder';
import { User } from '@aggregates/user/user.aggregate';

export class DragonFactory extends Factory<User> {
  public model = User;

  public definition(faker: Faker): Partial<User> {
    return {
      name: faker.animal.crocodilia(),
    };
  }
}
