import { Migration } from '@mikro-orm/migrations';

export class Migration20230829070126 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "outbox_message" alter column "occured_on" type timestamptz(0) using ("occured_on"::timestamptz(0));',
    );
    this.addSql(
      'alter table "outbox_message" alter column "processed_on" type timestamptz(0) using ("processed_on"::timestamptz(0));',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "outbox_message" alter column "occured_on" type date using ("occured_on"::date);',
    );
    this.addSql(
      'alter table "outbox_message" alter column "processed_on" type date using ("processed_on"::date);',
    );
  }
}
