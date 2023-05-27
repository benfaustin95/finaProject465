import { Migration } from "@mikro-orm/migrations";

export class Migration20230527051905 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'create table "one_time_income" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "owner_email" varchar(255) not null, "name" varchar(255) not null, "note" varchar(255) not null default \'\', "growth_rate" float not null default 1, "state_level" text null, "state_location" varchar(255) null, "federal_level" text null, "federal_location" varchar(255) null, "local_level" text null, "local_location" varchar(255) null, "date" timestamptz(0) not null, "cash_basis" int not null);'
		);
		this.addSql(
			'alter table "one_time_income" add constraint "one_time_income_name_unique" unique ("name");'
		);

		this.addSql(
			'alter table "one_time_income" add constraint "one_time_income_owner_email_foreign" foreign key ("owner_email") references "users" ("email") on update cascade;'
		);
		this.addSql(
			'alter table "one_time_income" add constraint "one_time_income_state_level_state_location_foreign" foreign key ("state_level", "state_location") references "tax_item" ("level", "location") on update cascade on delete set null;'
		);
		this.addSql(
			'alter table "one_time_income" add constraint "one_time_income_federal_level_federal_location_foreign" foreign key ("federal_level", "federal_location") references "tax_item" ("level", "location") on update cascade on delete set null;'
		);
		this.addSql(
			'alter table "one_time_income" add constraint "one_time_income_local_level_local_location_foreign" foreign key ("local_level", "local_location") references "tax_item" ("level", "location") on update cascade on delete set null;'
		);

		this.addSql(
			'alter table "rental_asset" alter column "growth_rate" type float using ("growth_rate"::float);'
		);
		this.addSql('alter table "rental_asset" alter column "growth_rate" set default 1;');

		this.addSql(
			'alter table "financial_asset" alter column "growth_rate" type float using ("growth_rate"::float);'
		);
		this.addSql('alter table "financial_asset" alter column "growth_rate" set default 1;');

		this.addSql(
			'alter table "dividend" alter column "growth_rate" type float using ("growth_rate"::float);'
		);
		this.addSql('alter table "dividend" alter column "growth_rate" set default 1;');

		this.addSql(
			'alter table "cap_asset" alter column "growth_rate" type float using ("growth_rate"::float);'
		);
		this.addSql('alter table "cap_asset" alter column "growth_rate" set default 1;');

		this.addSql(
			'alter table "budget_item" alter column "growth_rate" type float using ("growth_rate"::float);'
		);
		this.addSql('alter table "budget_item" alter column "growth_rate" set default 1;');
	}

	async down(): Promise<void> {
		this.addSql('drop table if exists "one_time_income" cascade;');

		this.addSql(
			'alter table "rental_asset" alter column "growth_rate" type float using ("growth_rate"::float);'
		);
		this.addSql('alter table "rental_asset" alter column "growth_rate" set default 0;');

		this.addSql(
			'alter table "financial_asset" alter column "growth_rate" type float using ("growth_rate"::float);'
		);
		this.addSql('alter table "financial_asset" alter column "growth_rate" set default 0;');

		this.addSql(
			'alter table "dividend" alter column "growth_rate" type float using ("growth_rate"::float);'
		);
		this.addSql('alter table "dividend" alter column "growth_rate" set default 0;');

		this.addSql(
			'alter table "cap_asset" alter column "growth_rate" type float using ("growth_rate"::float);'
		);
		this.addSql('alter table "cap_asset" alter column "growth_rate" set default 0;');

		this.addSql(
			'alter table "budget_item" alter column "growth_rate" type float using ("growth_rate"::float);'
		);
		this.addSql('alter table "budget_item" alter column "growth_rate" set default 0;');
	}
}
