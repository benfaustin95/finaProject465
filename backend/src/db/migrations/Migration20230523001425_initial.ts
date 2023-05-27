import { Migration } from '@mikro-orm/migrations';

export class Migration20230523001425 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "tax_item" ("level" text check ("level" in (\'state\', \'local\', \'federal\')) not null, "location" varchar(255) not null, "rate" int not null, constraint "tax_item_pkey" primary key ("level", "location"));');

    this.addSql('create table "users" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" varchar(255) not null, "name" varchar(255) not null, "age" int not null, "birthday" timestamptz(0) not null);');
    this.addSql('alter table "users" add constraint "users_email_unique" unique ("email");');

    this.addSql('create table "rental_asset" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "owner_id" int not null, "note" varchar(255) null, "growth_rate" int not null, "state_level" text null, "state_location" varchar(255) null, "federal_level" text null, "federal_location" varchar(255) null, "local_level" text null, "local_location" varchar(255) null, "total_value" int not null, "cost_basis" int not null, "w_priority" int not null, "owed" int not null, "maintence_expense" int not null, "gross_income" int not null);');
    this.addSql('alter table "rental_asset" add constraint "rental_asset_w_priority_unique" unique ("w_priority");');

    this.addSql('create table "financial_asset" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "owner_id" int not null, "note" varchar(255) null, "growth_rate" int not null, "state_level" text null, "state_location" varchar(255) null, "federal_level" text null, "federal_location" varchar(255) null, "local_level" text null, "local_location" varchar(255) null, "total_value" int not null, "cost_basis" int not null, "w_priority" int not null, "ira" boolean not null, "roth_ira" boolean not null, "brokerage" boolean not null, "brokerage_dividends" int not null);');
    this.addSql('alter table "financial_asset" add constraint "financial_asset_w_priority_unique" unique ("w_priority");');

    this.addSql('create table "dividend" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "owner_id" int not null, "note" varchar(255) null, "growth_rate" int not null, "state_level" text null, "state_location" varchar(255) null, "federal_level" text null, "federal_location" varchar(255) null, "local_level" text null, "local_location" varchar(255) null, "rate" int not null);');

    this.addSql('create table "cap_asset" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "owner_id" int not null, "note" varchar(255) null, "growth_rate" int not null, "state_level" text null, "state_location" varchar(255) null, "federal_level" text null, "federal_location" varchar(255) null, "local_level" text null, "local_location" varchar(255) null, "start" timestamptz(0) not null, "end" timestamptz(0) not null, "income" int not null, "recurrence" varchar(255) not null);');

    this.addSql('create table "budget_item" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "owner_id" int not null, "note" varchar(255) null, "growth_rate" int not null, "state_level" text null, "state_location" varchar(255) null, "federal_level" text null, "federal_location" varchar(255) null, "local_level" text null, "local_location" varchar(255) null, "name" varchar(255) not null, "amount" int not null, "recurrence" text check ("recurrence" in (\'daily\', \'weekly\', \'monthly\', \'annually\', \'non-reoccurring\')) not null);');

    this.addSql('alter table "rental_asset" add constraint "rental_asset_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "rental_asset" add constraint "rental_asset_state_level_state_location_foreign" foreign key ("state_level", "state_location") references "tax_item" ("level", "location") on update cascade on delete set null;');
    this.addSql('alter table "rental_asset" add constraint "rental_asset_federal_level_federal_location_foreign" foreign key ("federal_level", "federal_location") references "tax_item" ("level", "location") on update cascade on delete set null;');
    this.addSql('alter table "rental_asset" add constraint "rental_asset_local_level_local_location_foreign" foreign key ("local_level", "local_location") references "tax_item" ("level", "location") on update cascade on delete set null;');

    this.addSql('alter table "financial_asset" add constraint "financial_asset_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "financial_asset" add constraint "financial_asset_state_level_state_location_foreign" foreign key ("state_level", "state_location") references "tax_item" ("level", "location") on update cascade on delete set null;');
    this.addSql('alter table "financial_asset" add constraint "financial_asset_federal_level_federal_location_foreign" foreign key ("federal_level", "federal_location") references "tax_item" ("level", "location") on update cascade on delete set null;');
    this.addSql('alter table "financial_asset" add constraint "financial_asset_local_level_local_location_foreign" foreign key ("local_level", "local_location") references "tax_item" ("level", "location") on update cascade on delete set null;');

    this.addSql('alter table "dividend" add constraint "dividend_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "dividend" add constraint "dividend_state_level_state_location_foreign" foreign key ("state_level", "state_location") references "tax_item" ("level", "location") on update cascade on delete set null;');
    this.addSql('alter table "dividend" add constraint "dividend_federal_level_federal_location_foreign" foreign key ("federal_level", "federal_location") references "tax_item" ("level", "location") on update cascade on delete set null;');
    this.addSql('alter table "dividend" add constraint "dividend_local_level_local_location_foreign" foreign key ("local_level", "local_location") references "tax_item" ("level", "location") on update cascade on delete set null;');

    this.addSql('alter table "cap_asset" add constraint "cap_asset_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "cap_asset" add constraint "cap_asset_state_level_state_location_foreign" foreign key ("state_level", "state_location") references "tax_item" ("level", "location") on update cascade on delete set null;');
    this.addSql('alter table "cap_asset" add constraint "cap_asset_federal_level_federal_location_foreign" foreign key ("federal_level", "federal_location") references "tax_item" ("level", "location") on update cascade on delete set null;');
    this.addSql('alter table "cap_asset" add constraint "cap_asset_local_level_local_location_foreign" foreign key ("local_level", "local_location") references "tax_item" ("level", "location") on update cascade on delete set null;');

    this.addSql('alter table "budget_item" add constraint "budget_item_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "budget_item" add constraint "budget_item_state_level_state_location_foreign" foreign key ("state_level", "state_location") references "tax_item" ("level", "location") on update cascade on delete set null;');
    this.addSql('alter table "budget_item" add constraint "budget_item_federal_level_federal_location_foreign" foreign key ("federal_level", "federal_location") references "tax_item" ("level", "location") on update cascade on delete set null;');
    this.addSql('alter table "budget_item" add constraint "budget_item_local_level_local_location_foreign" foreign key ("local_level", "local_location") references "tax_item" ("level", "location") on update cascade on delete set null;');
  }

}
