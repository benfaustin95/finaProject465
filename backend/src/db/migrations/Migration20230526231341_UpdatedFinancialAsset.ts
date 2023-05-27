import { Migration } from '@mikro-orm/migrations';

export class Migration20230526231341 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "rental_asset" alter column "growth_rate" type float using ("growth_rate"::float);');

    this.addSql('alter table "financial_asset" alter column "growth_rate" type float using ("growth_rate"::float);');

    this.addSql('alter table "dividend" alter column "growth_rate" type float using ("growth_rate"::float);');

    this.addSql('alter table "cap_asset" alter column "growth_rate" type float using ("growth_rate"::float);');

    this.addSql('alter table "budget_item" alter column "growth_rate" type float using ("growth_rate"::float);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "rental_asset" alter column "growth_rate" type int using ("growth_rate"::int);');

    this.addSql('alter table "financial_asset" alter column "growth_rate" type int using ("growth_rate"::int);');

    this.addSql('alter table "dividend" alter column "growth_rate" type int using ("growth_rate"::int);');

    this.addSql('alter table "cap_asset" alter column "growth_rate" type int using ("growth_rate"::int);');

    this.addSql('alter table "budget_item" alter column "growth_rate" type int using ("growth_rate"::int);');
  }

}
