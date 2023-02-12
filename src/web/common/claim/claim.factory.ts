import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { Dragon } from '@aggregates/dragon/dragon.aggregate';
import { Hero } from '@aggregates/hero/hero.aggregate';
import { User } from '@aggregates/user/user.aggregate';
import {
  Permission,
  PermissionEnum,
} from '@aggregates/user/permission/permission';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export enum Resource {
  Hero = 'hero',
  Dragon = 'dragon',
}

type Subjects = InferSubjects<typeof Hero | typeof Dragon> | 'all';

export type AppAbility = MongoAbility<[PermissionEnum, Subjects]>;

@Injectable()
export class ClaimFactory {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Permission)
    private readonly permissionRepository: EntityRepository<Permission>,
  ) {}

  async createForUser(user: User) {
    const ability = new AbilityBuilder<AppAbility>(createMongoAbility);
    const adminPermission = await this.permissionRepository.findOne(
      {
        name: PermissionEnum.MANAGE,
      },
      { cache: true },
    );

    if (!(user.role.isInitialized() && user.role.permissions.isInitialized())) {
      await this.userRepository.populate(user, ['role.permissions']);
    }

    if (user.role.permissions.contains(adminPermission)) {
      ability.can(PermissionEnum.MANAGE, 'all');
    } else {
      user.role.permissions.getItems().forEach((permission) => {
        ability.can(permission.name, Dragon);
      });
    }

    return ability.build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
