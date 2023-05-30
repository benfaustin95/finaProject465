import { Migration } from '@mikro-orm/migrations';

export class Migration20230527232241 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "cap_asset" add column "type" text check ("type" in (\'human capital\', \'non-taxable annuity\', \'social capital\')) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "cap_asset" drop column "type";');
  }

}
