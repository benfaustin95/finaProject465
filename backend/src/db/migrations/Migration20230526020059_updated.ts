import { Migration } from '@mikro-orm/migrations';

export class Migration20230526020059 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" drop column "age";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "users" add column "age" int not null;');
  }

}
