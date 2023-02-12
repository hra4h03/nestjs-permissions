import { BaseEntity, Entity, Enum, PrimaryKey, Unique } from '@mikro-orm/core';

@Entity()
@Unique<Permission>({ properties: ['name'] })
export class Permission extends BaseEntity<Permission, 'id'> {
  @PrimaryKey({ primary: true, autoincrement: true })
  public readonly id: number;

  @Enum(() => PermissionEnum)
  public readonly name!: PermissionEnum;

  constructor(name: PermissionEnum) {
    super();
    this.name = name;
  }
}

export enum PermissionEnum {
  MANAGE = 'manage',
  MANAGE_USERS = 'manage_users',
}
