import { Migration } from '@mikro-orm/migrations';

export class Migration20230525055653 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "rental_asset" drop constraint "rental_asset_owner_id_foreign";');

    this.addSql('alter table "financial_asset" drop constraint "financial_asset_owner_id_foreign";');

    this.addSql('alter table "dividend" drop constraint "dividend_owner_id_foreign";');

    this.addSql('alter table "cap_asset" drop constraint "cap_asset_owner_id_foreign";');

    this.addSql('alter table "budget_item" drop constraint "budget_item_owner_id_foreign";');

    this.addSql('alter table "users" add column "deleted_at" timestamptz(0) null;');
    this.addSql('alter table "users" drop constraint "users_email_unique";');
    this.addSql('alter table "users" drop constraint "users_pkey";');
    this.addSql('alter table "users" drop column "id";');
    this.addSql('alter table "users" add constraint "users_pkey" primary key ("email");');

    this.addSql('alter table "rental_asset" add column "deleted_at" timestamptz(0) null, add column "owner_email" varchar(255) not null, add column "name" varchar(255) not null, add column "maintenance_expense" int not null;');
    this.addSql('alter table "rental_asset" add constraint "rental_asset_owner_email_foreign" foreign key ("owner_email") references "users" ("email") on update cascade;');
    this.addSql('alter table "rental_asset" drop column "owner_id";');
    this.addSql('alter table "rental_asset" drop column "maintence_expense";');

    this.addSql('alter table "financial_asset" add column "deleted_at" timestamptz(0) null, add column "owner_email" varchar(255) not null, add column "name" varchar(255) not null, add column "fin_type" text check ("fin_type" in (\'daily\', \'weekly\', \'monthly\', \'annually\', \'non-reoccurring\')) not null;');
    this.addSql('alter table "financial_asset" add constraint "financial_asset_owner_email_foreign" foreign key ("owner_email") references "users" ("email") on update cascade;');
    this.addSql('alter table "financial_asset" drop column "owner_id";');
    this.addSql('alter table "financial_asset" drop column "ira";');
    this.addSql('alter table "financial_asset" drop column "roth_ira";');
    this.addSql('alter table "financial_asset" drop column "brokerage";');

    this.addSql('alter table "dividend" add column "deleted_at" timestamptz(0) null, add column "owner_email" varchar(255) not null, add column "name" varchar(255) not null;');
    this.addSql('alter table "dividend" add constraint "dividend_owner_email_foreign" foreign key ("owner_email") references "users" ("email") on update cascade;');
    this.addSql('alter table "dividend" rename column "owner_id" to "asset_id";');
    this.addSql('alter table "dividend" add constraint "dividend_asset_id_foreign" foreign key ("asset_id") references "financial_asset" ("id") on update cascade;');
    this.addSql('alter table "dividend" add constraint "dividend_asset_id_unique" unique ("asset_id");');

    this.addSql('alter table "cap_asset" add column "deleted_at" timestamptz(0) null, add column "owner_email" varchar(255) not null, add column "name" varchar(255) not null;');
    this.addSql('alter table "cap_asset" add constraint "cap_asset_owner_email_foreign" foreign key ("owner_email") references "users" ("email") on update cascade;');
    this.addSql('alter table "cap_asset" drop column "owner_id";');

    this.addSql('alter table "budget_item" add column "deleted_at" timestamptz(0) null, add column "owner_email" varchar(255) not null, add column "start" timestamptz(0) null, add column "end" timestamptz(0) null;');
    this.addSql('alter table "budget_item" add constraint "budget_item_owner_email_foreign" foreign key ("owner_email") references "users" ("email") on update cascade;');
    this.addSql('alter table "budget_item" drop column "owner_id";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "rental_asset" drop constraint "rental_asset_owner_email_foreign";');

    this.addSql('alter table "financial_asset" drop constraint "financial_asset_owner_email_foreign";');

    this.addSql('alter table "dividend" drop constraint "dividend_owner_email_foreign";');
    this.addSql('alter table "dividend" drop constraint "dividend_asset_id_foreign";');

    this.addSql('alter table "cap_asset" drop constraint "cap_asset_owner_email_foreign";');

    this.addSql('alter table "budget_item" drop constraint "budget_item_owner_email_foreign";');

    this.addSql('alter table "users" add column "id" serial;');
    this.addSql('alter table "users" drop constraint "users_pkey";');
    this.addSql('alter table "users" drop column "deleted_at";');
    this.addSql('alter table "users" add constraint "users_email_unique" unique ("email");');
    this.addSql('alter table "users" add constraint "users_pkey" primary key ("id");');

    this.addSql('alter table "rental_asset" add column "maintence_expense" int not null;');
    this.addSql('alter table "rental_asset" drop column "deleted_at";');
    this.addSql('alter table "rental_asset" drop column "owner_email";');
    this.addSql('alter table "rental_asset" drop column "name";');
    this.addSql('alter table "rental_asset" rename column "maintenance_expense" to "owner_id";');
    this.addSql('alter table "rental_asset" add constraint "rental_asset_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade;');

    this.addSql('alter table "financial_asset" add column "owner_id" int not null, add column "ira" boolean not null, add column "roth_ira" boolean not null, add column "brokerage" boolean not null;');
    this.addSql('alter table "financial_asset" add constraint "financial_asset_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "financial_asset" drop column "deleted_at";');
    this.addSql('alter table "financial_asset" drop column "owner_email";');
    this.addSql('alter table "financial_asset" drop column "name";');
    this.addSql('alter table "financial_asset" drop column "fin_type";');

    this.addSql('alter table "dividend" drop constraint "dividend_asset_id_unique";');
    this.addSql('alter table "dividend" drop column "deleted_at";');
    this.addSql('alter table "dividend" drop column "owner_email";');
    this.addSql('alter table "dividend" drop column "name";');
    this.addSql('alter table "dividend" rename column "asset_id" to "owner_id";');
    this.addSql('alter table "dividend" add constraint "dividend_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade;');

    this.addSql('alter table "cap_asset" add column "owner_id" int not null;');
    this.addSql('alter table "cap_asset" add constraint "cap_asset_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "cap_asset" drop column "deleted_at";');
    this.addSql('alter table "cap_asset" drop column "owner_email";');
    this.addSql('alter table "cap_asset" drop column "name";');

    this.addSql('alter table "budget_item" add column "owner_id" int not null;');
    this.addSql('alter table "budget_item" add constraint "budget_item_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "budget_item" drop column "deleted_at";');
    this.addSql('alter table "budget_item" drop column "owner_email";');
    this.addSql('alter table "budget_item" drop column "start";');
    this.addSql('alter table "budget_item" drop column "end";');
  }

}
