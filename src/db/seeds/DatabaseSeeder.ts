import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { HeroDragonSeeder } from '@/db/seeds/HeroDragonSeeder';
import { UserSeeder } from '@/db/seeds/UserSeeder';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    return this.call(em, [HeroDragonSeeder, UserSeeder]);
  }
}
