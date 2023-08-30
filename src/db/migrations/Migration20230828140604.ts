import { Migration } from '@mikro-orm/migrations';

export class Migration20230828140604 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "outbox_message" ("id" serial primary key, "type" varchar(255) not null, "content" varchar(255) null, "occured_on" date not null, "processed_on" date null);',
    );

    this.addSql(
      'alter table "permission" alter column "name" type text using ("name"::text);',
    );
    this.addSql(
      'alter table "permission" add constraint "permission_name_check" check ("name" in (\'manage\', \'manage_users\'));',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "outbox_message" cascade;');

    this.addSql(
      'alter table "permission" drop constraint if exists "permission_name_check";',
    );

    this.addSql(
      'alter table "permission" alter column "name" type varchar(255) using ("name"::varchar(255));',
    );
  }
}
