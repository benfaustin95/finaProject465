import { Migration } from '@mikro-orm/migrations';

export class Migration20230526231438 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "tax_item" alter column "rate" type float using ("rate"::float);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "tax_item" alter column "rate" type int using ("rate"::int);');
  }

}
