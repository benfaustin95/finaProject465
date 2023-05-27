import { Migration } from '@mikro-orm/migrations';

export class Migration20230526225500 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "rental_asset" alter column "growth_rate" type int using ("growth_rate"::int);');
    this.addSql('alter table "rental_asset" alter column "growth_rate" set default 0;');
    this.addSql('alter table "rental_asset" add constraint "rental_asset_name_unique" unique ("name");');

    this.addSql('alter table "financial_asset" alter column "growth_rate" type int using ("growth_rate"::int);');
    this.addSql('alter table "financial_asset" alter column "growth_rate" set default 0;');
    this.addSql('alter table "financial_asset" drop column "fin_type";');
    this.addSql('alter table "financial_asset" drop column "brokerage_dividends";');
    this.addSql('alter table "financial_asset" add constraint "financial_asset_name_unique" unique ("name");');

    this.addSql('alter table "dividend" alter column "growth_rate" type int using ("growth_rate"::int);');
    this.addSql('alter table "dividend" alter column "growth_rate" set default 0;');
    this.addSql('alter table "dividend" drop constraint "dividend_asset_id_unique";');
    this.addSql('alter table "dividend" add constraint "dividend_name_unique" unique ("name");');

    this.addSql('alter table "cap_asset" alter column "growth_rate" type int using ("growth_rate"::int);');
    this.addSql('alter table "cap_asset" alter column "growth_rate" set default 0;');
    this.addSql('alter table "cap_asset" add constraint "cap_asset_name_unique" unique ("name");');

    this.addSql('alter table "budget_item" alter column "growth_rate" type int using ("growth_rate"::int);');
    this.addSql('alter table "budget_item" alter column "growth_rate" set default 0;');
    this.addSql('alter table "budget_item" add constraint "budget_item_name_unique" unique ("name");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "rental_asset" alter column "growth_rate" drop default;');
    this.addSql('alter table "rental_asset" alter column "growth_rate" type int using ("growth_rate"::int);');
    this.addSql('alter table "rental_asset" drop constraint "rental_asset_name_unique";');

    this.addSql('alter table "financial_asset" add column "fin_type" text check ("fin_type" in (\'daily\', \'weekly\', \'monthly\', \'annually\', \'non-reoccurring\')) not null, add column "brokerage_dividends" int not null;');
    this.addSql('alter table "financial_asset" alter column "growth_rate" drop default;');
    this.addSql('alter table "financial_asset" alter column "growth_rate" type int using ("growth_rate"::int);');
    this.addSql('alter table "financial_asset" drop constraint "financial_asset_name_unique";');

    this.addSql('alter table "dividend" alter column "growth_rate" drop default;');
    this.addSql('alter table "dividend" alter column "growth_rate" type int using ("growth_rate"::int);');
    this.addSql('alter table "dividend" drop constraint "dividend_name_unique";');
    this.addSql('alter table "dividend" add constraint "dividend_asset_id_unique" unique ("asset_id");');

    this.addSql('alter table "cap_asset" alter column "growth_rate" drop default;');
    this.addSql('alter table "cap_asset" alter column "growth_rate" type int using ("growth_rate"::int);');
    this.addSql('alter table "cap_asset" drop constraint "cap_asset_name_unique";');

    this.addSql('alter table "budget_item" alter column "growth_rate" drop default;');
    this.addSql('alter table "budget_item" alter column "growth_rate" type int using ("growth_rate"::int);');
    this.addSql('alter table "budget_item" drop constraint "budget_item_name_unique";');
  }

}
