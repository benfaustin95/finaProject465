import { Migration } from '@mikro-orm/migrations';

export class Migration20230530054144 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "tax_item" alter column "rate" type float using ("rate"::float);');

    this.addSql('alter table "users" add column "start" timestamptz(0) not null;');

    this.addSql('alter table "rental_asset" add column "capital_gains_level" varchar(255) null, add column "capital_gains_location" varchar(255) null;');
    this.addSql('alter table "rental_asset" alter column "growth_rate" type float using ("growth_rate"::float);');
    this.addSql('alter table "rental_asset" add constraint "rental_asset_capital_gains_level_capital_gains_location_foreign" foreign key ("capital_gains_level", "capital_gains_location") references "tax_item" ("level", "location") on update cascade on delete set null;');

    this.addSql('alter table "one_time_income" add column "capital_gains_level" varchar(255) null, add column "capital_gains_location" varchar(255) null;');
    this.addSql('alter table "one_time_income" alter column "growth_rate" type float using ("growth_rate"::float);');
    this.addSql('alter table "one_time_income" add constraint "one_time_income_capital_gains_level_capital_gains_d70b0_foreign" foreign key ("capital_gains_level", "capital_gains_location") references "tax_item" ("level", "location") on update cascade on delete set null;');

    this.addSql('alter table "financial_asset" add column "capital_gains_level" varchar(255) null, add column "capital_gains_location" varchar(255) null;');
    this.addSql('alter table "financial_asset" alter column "growth_rate" type float using ("growth_rate"::float);');
    this.addSql('alter table "financial_asset" add constraint "financial_asset_capital_gains_level_capital_gains_6bda7_foreign" foreign key ("capital_gains_level", "capital_gains_location") references "tax_item" ("level", "location") on update cascade on delete set null;');

    this.addSql('alter table "dividend" add column "capital_gains_level" varchar(255) null, add column "capital_gains_location" varchar(255) null;');
    this.addSql('alter table "dividend" alter column "growth_rate" type float using ("growth_rate"::float);');
    this.addSql('alter table "dividend" alter column "rate" type float using ("rate"::float);');
    this.addSql('alter table "dividend" add constraint "dividend_capital_gains_level_capital_gains_location_foreign" foreign key ("capital_gains_level", "capital_gains_location") references "tax_item" ("level", "location") on update cascade on delete set null;');

    this.addSql('alter table "cap_asset" add column "capital_gains_level" varchar(255) null, add column "capital_gains_location" varchar(255) null;');
    this.addSql('alter table "cap_asset" alter column "growth_rate" type float using ("growth_rate"::float);');
    this.addSql('alter table "cap_asset" add constraint "cap_asset_capital_gains_level_capital_gains_location_foreign" foreign key ("capital_gains_level", "capital_gains_location") references "tax_item" ("level", "location") on update cascade on delete set null;');

    this.addSql('alter table "budget_item" add column "capital_gains_level" varchar(255) null, add column "capital_gains_location" varchar(255) null;');
    this.addSql('alter table "budget_item" alter column "growth_rate" type float using ("growth_rate"::float);');
    this.addSql('alter table "budget_item" add constraint "budget_item_capital_gains_level_capital_gains_location_foreign" foreign key ("capital_gains_level", "capital_gains_location") references "tax_item" ("level", "location") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "budget_item" drop constraint "budget_item_capital_gains_level_capital_gains_location_foreign";');

    this.addSql('alter table "cap_asset" drop constraint "cap_asset_capital_gains_level_capital_gains_location_foreign";');

    this.addSql('alter table "dividend" drop constraint "dividend_capital_gains_level_capital_gains_location_foreign";');

    this.addSql('alter table "financial_asset" drop constraint "financial_asset_capital_gains_level_capital_gains_6bda7_foreign";');

    this.addSql('alter table "one_time_income" drop constraint "one_time_income_capital_gains_level_capital_gains_d70b0_foreign";');

    this.addSql('alter table "rental_asset" drop constraint "rental_asset_capital_gains_level_capital_gains_location_foreign";');

    this.addSql('alter table "budget_item" alter column "growth_rate" type float8 using ("growth_rate"::float8);');
    this.addSql('alter table "budget_item" drop column "capital_gains_level";');
    this.addSql('alter table "budget_item" drop column "capital_gains_location";');

    this.addSql('alter table "cap_asset" alter column "growth_rate" type float8 using ("growth_rate"::float8);');
    this.addSql('alter table "cap_asset" drop column "capital_gains_level";');
    this.addSql('alter table "cap_asset" drop column "capital_gains_location";');

    this.addSql('alter table "dividend" alter column "growth_rate" type float8 using ("growth_rate"::float8);');
    this.addSql('alter table "dividend" alter column "rate" type float8 using ("rate"::float8);');
    this.addSql('alter table "dividend" drop column "capital_gains_level";');
    this.addSql('alter table "dividend" drop column "capital_gains_location";');

    this.addSql('alter table "financial_asset" alter column "growth_rate" type float8 using ("growth_rate"::float8);');
    this.addSql('alter table "financial_asset" drop column "capital_gains_level";');
    this.addSql('alter table "financial_asset" drop column "capital_gains_location";');

    this.addSql('alter table "one_time_income" alter column "growth_rate" type float8 using ("growth_rate"::float8);');
    this.addSql('alter table "one_time_income" drop column "capital_gains_level";');
    this.addSql('alter table "one_time_income" drop column "capital_gains_location";');

    this.addSql('alter table "rental_asset" alter column "growth_rate" type float8 using ("growth_rate"::float8);');
    this.addSql('alter table "rental_asset" drop column "capital_gains_level";');
    this.addSql('alter table "rental_asset" drop column "capital_gains_location";');

    this.addSql('alter table "tax_item" alter column "rate" type float8 using ("rate"::float8);');

    this.addSql('alter table "users" drop column "start";');
  }

}
