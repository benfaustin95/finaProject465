import { Migration } from '@mikro-orm/migrations';

export class Migration20240105004239 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" add column "marital_status" smallint not null default 0;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "users" drop column "marital_status";');
  }

}
