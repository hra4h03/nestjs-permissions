import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import {
  Permission,
  PermissionEnum,
} from '@aggregates/user/permission/permission';
import { User } from '@aggregates/user/user.aggregate';
import { Role } from '@aggregates/user/role/role';

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const defaults = Object.values(PermissionEnum).map(
      (permission) => new Permission(permission),
    );

    em.persist(defaults);

    const adminPermission = await em
      .getRepository(Permission)
      .findOne({ name: PermissionEnum.MANAGE });

    const role = new Role({
      name: 'admin',
    });

    role.permissions.add(adminPermission);
    em.persist(role);

    const admin = new User({
      role: role,
      name: 'admin',
      password: 'admin',
    });

    em.persist(admin);
  }
}
