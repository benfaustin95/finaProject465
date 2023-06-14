import { Migration } from "@mikro-orm/migrations";

export class Migration20230530224718 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'create table "tax_rate" ("level" varchar(255) not null, "location" varchar(255) not null, "rate" float not null, constraint "tax_rate_pkey" primary key ("level", "location"));'
		);

		this.addSql(
			'create table "users" ("email" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "name" varchar(255) not null, "birthday" timestamptz(0) not null, "start" timestamptz(0) not null, constraint "users_pkey" primary key ("email"));'
		);

		this.addSql(
			'create table "rental_asset" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "owner_email" varchar(255) not null, "name" varchar(255) not null, "note" varchar(255) not null default \'\', "growth_rate" float not null default 1, "state_level" varchar(255) null, "state_location" varchar(255) null, "federal_level" varchar(255) null, "federal_location" varchar(255) null, "local_level" varchar(255) null, "local_location" varchar(255) null, "capital_gains_level" varchar(255) null, "capital_gains_location" varchar(255) null, "total_value" int not null, "cost_basis" int not null, "w_priority" int not null, "owed" int not null, "maintenance_expense" int not null, "gross_income" int not null);'
		);
		this.addSql(
			'alter table "rental_asset" add constraint "rental_asset_name_unique" unique ("name");'
		);
		this.addSql(
			'alter table "rental_asset" add constraint "rental_asset_w_priority_unique" unique ("w_priority");'
		);

		this.addSql(
			'create table "one_time_income" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "owner_email" varchar(255) not null, "name" varchar(255) not null, "note" varchar(255) not null default \'\', "growth_rate" float not null default 1, "state_level" varchar(255) null, "state_location" varchar(255) null, "federal_level" varchar(255) null, "federal_location" varchar(255) null, "local_level" varchar(255) null, "local_location" varchar(255) null, "capital_gains_level" varchar(255) null, "capital_gains_location" varchar(255) null, "date" timestamptz(0) not null, "cash_basis" int not null);'
		);
		this.addSql(
			'alter table "one_time_income" add constraint "one_time_income_name_unique" unique ("name");'
		);

		this.addSql(
			'create table "financial_asset" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "owner_email" varchar(255) not null, "name" varchar(255) not null, "note" varchar(255) not null default \'\', "growth_rate" float not null default 1, "state_level" varchar(255) null, "state_location" varchar(255) null, "federal_level" varchar(255) null, "federal_location" varchar(255) null, "local_level" varchar(255) null, "local_location" varchar(255) null, "capital_gains_level" varchar(255) null, "capital_gains_location" varchar(255) null, "total_value" int not null, "cost_basis" int not null, "w_priority" int not null);'
		);
		this.addSql(
			'alter table "financial_asset" add constraint "financial_asset_name_unique" unique ("name");'
		);
		this.addSql(
			'alter table "financial_asset" add constraint "financial_asset_w_priority_unique" unique ("w_priority");'
		);

		this.addSql(
			'create table "dividend" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "owner_email" varchar(255) not null, "name" varchar(255) not null, "note" varchar(255) not null default \'\', "growth_rate" float not null default 1, "state_level" varchar(255) null, "state_location" varchar(255) null, "federal_level" varchar(255) null, "federal_location" varchar(255) null, "local_level" varchar(255) null, "local_location" varchar(255) null, "capital_gains_level" varchar(255) null, "capital_gains_location" varchar(255) null, "rate" float not null, "asset_id" int not null);'
		);
		this.addSql('alter table "dividend" add constraint "dividend_name_unique" unique ("name");');

		this.addSql(
			'create table "cap_asset" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "owner_email" varchar(255) not null, "name" varchar(255) not null, "note" varchar(255) not null default \'\', "growth_rate" float not null default 1, "state_level" varchar(255) null, "state_location" varchar(255) null, "federal_level" varchar(255) null, "federal_location" varchar(255) null, "local_level" varchar(255) null, "local_location" varchar(255) null, "capital_gains_level" varchar(255) null, "capital_gains_location" varchar(255) null, "start" timestamptz(0) not null, "end" timestamptz(0) not null, "income" int not null, "type" text check ("type" in (\'human capital\', \'non-taxable annuity\', \'social capital\')) not null, "recurrence" varchar(255) not null);'
		);
		this.addSql('alter table "cap_asset" add constraint "cap_asset_name_unique" unique ("name");');

		this.addSql(
			'create table "budget_item" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "owner_email" varchar(255) not null, "name" varchar(255) not null, "note" varchar(255) not null default \'\', "growth_rate" float not null default 1, "state_level" varchar(255) null, "state_location" varchar(255) null, "federal_level" varchar(255) null, "federal_location" varchar(255) null, "local_level" varchar(255) null, "local_location" varchar(255) null, "capital_gains_level" varchar(255) null, "capital_gains_location" varchar(255) null, "amount" int not null, "recurrence" text check ("recurrence" in (\'daily\', \'weekly\', \'monthly\', \'annually\', \'non-reoccurring\')) not null, "start" timestamptz(0) not null, "end" timestamptz(0) not null);'
		);
		this.addSql(
			'alter table "budget_item" add constraint "budget_item_name_unique" unique ("name");'
		);

		this.addSql(
			'alter table "rental_asset" add constraint "rental_asset_owner_email_foreign" foreign key ("owner_email") references "users" ("email") on update cascade;'
		);
		this.addSql(
			'alter table "rental_asset" add constraint "rental_asset_state_level_state_location_foreign" foreign key ("state_level", "state_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);
		this.addSql(
			'alter table "rental_asset" add constraint "rental_asset_federal_level_federal_location_foreign" foreign key ("federal_level", "federal_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);
		this.addSql(
			'alter table "rental_asset" add constraint "rental_asset_local_level_local_location_foreign" foreign key ("local_level", "local_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);
		this.addSql(
			'alter table "rental_asset" add constraint "rental_asset_capital_gains_level_capital_gains_location_foreign" foreign key ("capital_gains_level", "capital_gains_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);

		this.addSql(
			'alter table "one_time_income" add constraint "one_time_income_owner_email_foreign" foreign key ("owner_email") references "users" ("email") on update cascade;'
		);
		this.addSql(
			'alter table "one_time_income" add constraint "one_time_income_state_level_state_location_foreign" foreign key ("state_level", "state_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);
		this.addSql(
			'alter table "one_time_income" add constraint "one_time_income_federal_level_federal_location_foreign" foreign key ("federal_level", "federal_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);
		this.addSql(
			'alter table "one_time_income" add constraint "one_time_income_local_level_local_location_foreign" foreign key ("local_level", "local_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);
		this.addSql(
			'alter table "one_time_income" add constraint "one_time_income_capital_gains_level_capital_gains_d70b0_foreign" foreign key ("capital_gains_level", "capital_gains_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);

		this.addSql(
			'alter table "financial_asset" add constraint "financial_asset_owner_email_foreign" foreign key ("owner_email") references "users" ("email") on update cascade;'
		);
		this.addSql(
			'alter table "financial_asset" add constraint "financial_asset_state_level_state_location_foreign" foreign key ("state_level", "state_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);
		this.addSql(
			'alter table "financial_asset" add constraint "financial_asset_federal_level_federal_location_foreign" foreign key ("federal_level", "federal_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);
		this.addSql(
			'alter table "financial_asset" add constraint "financial_asset_local_level_local_location_foreign" foreign key ("local_level", "local_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);
		this.addSql(
			'alter table "financial_asset" add constraint "financial_asset_capital_gains_level_capital_gains_6bda7_foreign" foreign key ("capital_gains_level", "capital_gains_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);

		this.addSql(
			'alter table "dividend" add constraint "dividend_owner_email_foreign" foreign key ("owner_email") references "users" ("email") on update cascade;'
		);
		this.addSql(
			'alter table "dividend" add constraint "dividend_state_level_state_location_foreign" foreign key ("state_level", "state_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);
		this.addSql(
			'alter table "dividend" add constraint "dividend_federal_level_federal_location_foreign" foreign key ("federal_level", "federal_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);
		this.addSql(
			'alter table "dividend" add constraint "dividend_local_level_local_location_foreign" foreign key ("local_level", "local_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);
		this.addSql(
			'alter table "dividend" add constraint "dividend_capital_gains_level_capital_gains_location_foreign" foreign key ("capital_gains_level", "capital_gains_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);
		this.addSql(
			'alter table "dividend" add constraint "dividend_asset_id_foreign" foreign key ("asset_id") references "financial_asset" ("id") on update cascade;'
		);

		this.addSql(
			'alter table "cap_asset" add constraint "cap_asset_owner_email_foreign" foreign key ("owner_email") references "users" ("email") on update cascade;'
		);
		this.addSql(
			'alter table "cap_asset" add constraint "cap_asset_state_level_state_location_foreign" foreign key ("state_level", "state_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);
		this.addSql(
			'alter table "cap_asset" add constraint "cap_asset_federal_level_federal_location_foreign" foreign key ("federal_level", "federal_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);
		this.addSql(
			'alter table "cap_asset" add constraint "cap_asset_local_level_local_location_foreign" foreign key ("local_level", "local_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);
		this.addSql(
			'alter table "cap_asset" add constraint "cap_asset_capital_gains_level_capital_gains_location_foreign" foreign key ("capital_gains_level", "capital_gains_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);

		this.addSql(
			'alter table "budget_item" add constraint "budget_item_owner_email_foreign" foreign key ("owner_email") references "users" ("email") on update cascade;'
		);
		this.addSql(
			'alter table "budget_item" add constraint "budget_item_state_level_state_location_foreign" foreign key ("state_level", "state_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);
		this.addSql(
			'alter table "budget_item" add constraint "budget_item_federal_level_federal_location_foreign" foreign key ("federal_level", "federal_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);
		this.addSql(
			'alter table "budget_item" add constraint "budget_item_local_level_local_location_foreign" foreign key ("local_level", "local_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);
		this.addSql(
			'alter table "budget_item" add constraint "budget_item_capital_gains_level_capital_gains_location_foreign" foreign key ("capital_gains_level", "capital_gains_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);
	}

	async down(): Promise<void> {
		this.addSql(
			'alter table "rental_asset" drop constraint "rental_asset_state_level_state_location_foreign";'
		);

		this.addSql(
			'alter table "rental_asset" drop constraint "rental_asset_federal_level_federal_location_foreign";'
		);

		this.addSql(
			'alter table "rental_asset" drop constraint "rental_asset_local_level_local_location_foreign";'
		);

		this.addSql(
			'alter table "rental_asset" drop constraint "rental_asset_capital_gains_level_capital_gains_location_foreign";'
		);

		this.addSql(
			'alter table "one_time_income" drop constraint "one_time_income_state_level_state_location_foreign";'
		);

		this.addSql(
			'alter table "one_time_income" drop constraint "one_time_income_federal_level_federal_location_foreign";'
		);

		this.addSql(
			'alter table "one_time_income" drop constraint "one_time_income_local_level_local_location_foreign";'
		);

		this.addSql(
			'alter table "one_time_income" drop constraint "one_time_income_capital_gains_level_capital_gains_d70b0_foreign";'
		);

		this.addSql(
			'alter table "financial_asset" drop constraint "financial_asset_state_level_state_location_foreign";'
		);

		this.addSql(
			'alter table "financial_asset" drop constraint "financial_asset_federal_level_federal_location_foreign";'
		);

		this.addSql(
			'alter table "financial_asset" drop constraint "financial_asset_local_level_local_location_foreign";'
		);

		this.addSql(
			'alter table "financial_asset" drop constraint "financial_asset_capital_gains_level_capital_gains_6bda7_foreign";'
		);

		this.addSql(
			'alter table "dividend" drop constraint "dividend_state_level_state_location_foreign";'
		);

		this.addSql(
			'alter table "dividend" drop constraint "dividend_federal_level_federal_location_foreign";'
		);

		this.addSql(
			'alter table "dividend" drop constraint "dividend_local_level_local_location_foreign";'
		);

		this.addSql(
			'alter table "dividend" drop constraint "dividend_capital_gains_level_capital_gains_location_foreign";'
		);

		this.addSql(
			'alter table "cap_asset" drop constraint "cap_asset_state_level_state_location_foreign";'
		);

		this.addSql(
			'alter table "cap_asset" drop constraint "cap_asset_federal_level_federal_location_foreign";'
		);

		this.addSql(
			'alter table "cap_asset" drop constraint "cap_asset_local_level_local_location_foreign";'
		);

		this.addSql(
			'alter table "cap_asset" drop constraint "cap_asset_capital_gains_level_capital_gains_location_foreign";'
		);

		this.addSql(
			'alter table "budget_item" drop constraint "budget_item_state_level_state_location_foreign";'
		);

		this.addSql(
			'alter table "budget_item" drop constraint "budget_item_federal_level_federal_location_foreign";'
		);

		this.addSql(
			'alter table "budget_item" drop constraint "budget_item_local_level_local_location_foreign";'
		);

		this.addSql(
			'alter table "budget_item" drop constraint "budget_item_capital_gains_level_capital_gains_location_foreign";'
		);

		this.addSql('alter table "rental_asset" drop constraint "rental_asset_owner_email_foreign";');

		this.addSql(
			'alter table "one_time_income" drop constraint "one_time_income_owner_email_foreign";'
		);

		this.addSql(
			'alter table "financial_asset" drop constraint "financial_asset_owner_email_foreign";'
		);

		this.addSql('alter table "dividend" drop constraint "dividend_owner_email_foreign";');

		this.addSql('alter table "cap_asset" drop constraint "cap_asset_owner_email_foreign";');

		this.addSql('alter table "budget_item" drop constraint "budget_item_owner_email_foreign";');

		this.addSql('alter table "dividend" drop constraint "dividend_asset_id_foreign";');

		this.addSql('drop table if exists "tax_rate" cascade;');

		this.addSql('drop table if exists "users" cascade;');

		this.addSql('drop table if exists "rental_asset" cascade;');

		this.addSql('drop table if exists "one_time_income" cascade;');

		this.addSql('drop table if exists "financial_asset" cascade;');

		this.addSql('drop table if exists "dividend" cascade;');

		this.addSql('drop table if exists "cap_asset" cascade;');

		this.addSql('drop table if exists "budget_item" cascade;');
	}
}
