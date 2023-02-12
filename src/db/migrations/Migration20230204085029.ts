import { Migration } from '@mikro-orm/migrations';

export class Migration20230204085029 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "hero" ("id" serial primary key, "name" varchar(255) not null, "skill" int not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "killed_dragons_count" int not null default 0, constraint hero_check check (skill >= 0));');
    this.addSql('alter table "hero" add constraint "hero_name_unique" unique ("name");');

    this.addSql('create table "dragon" ("id" serial primary key, "name" varchar(255) not null, "status" smallint not null default 0, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "killed_by_id" int null);');

    this.addSql('create table "permission" ("id" serial primary key, "name" varchar(255) not null);');
    this.addSql('alter table "permission" add constraint "permission_name_unique" unique ("name");');

    this.addSql('create table "role" ("id" serial primary key, "name" varchar(255) not null);');
    this.addSql('alter table "role" add constraint "role_name_unique" unique ("name");');

    this.addSql('create table "role_permissions" ("role_id" int not null, "permission_id" int not null, constraint "role_permissions_pkey" primary key ("role_id", "permission_id"));');

    this.addSql('create table "user" ("id" serial primary key, "name" varchar(255) not null, "password" varchar(255) not null, "role_id" int not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "user" add constraint "user_name_unique" unique ("name");');

    this.addSql('alter table "dragon" add constraint "dragon_killed_by_id_foreign" foreign key ("killed_by_id") references "hero" ("id") on update cascade on delete set null;');

    this.addSql('alter table "role_permissions" add constraint "role_permissions_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "role_permissions" add constraint "role_permissions_permission_id_foreign" foreign key ("permission_id") references "permission" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "user" add constraint "user_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade;');
  }

}
