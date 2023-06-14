import { Migration } from "@mikro-orm/migrations";

export class Migration20230530231732 extends Migration {
	async up(): Promise<void> {
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

		this.addSql('alter table "users" add column "id" serial;');
		this.addSql('alter table "users" drop constraint "users_pkey";');
		this.addSql('alter table "users" add constraint "users_pkey" primary key ("id");');

		this.addSql('alter table "rental_asset" add column "owner_id" int not null;');
		this.addSql(
			'alter table "rental_asset" add constraint "rental_asset_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade;'
		);
		this.addSql('alter table "rental_asset" drop column "owner_email";');

		this.addSql('alter table "one_time_income" add column "owner_id" int not null;');
		this.addSql(
			'alter table "one_time_income" add constraint "one_time_income_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade;'
		);
		this.addSql('alter table "one_time_income" drop column "owner_email";');

		this.addSql('alter table "financial_asset" add column "owner_id" int not null;');
		this.addSql(
			'alter table "financial_asset" add constraint "financial_asset_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade;'
		);
		this.addSql('alter table "financial_asset" drop column "owner_email";');

		this.addSql('alter table "dividend" add column "owner_id" int not null;');
		this.addSql(
			'alter table "dividend" add constraint "dividend_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade;'
		);
		this.addSql('alter table "dividend" drop column "owner_email";');

		this.addSql('alter table "cap_asset" add column "owner_id" int not null;');
		this.addSql(
			'alter table "cap_asset" add constraint "cap_asset_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade;'
		);
		this.addSql('alter table "cap_asset" drop column "owner_email";');

		this.addSql('alter table "budget_item" add column "owner_id" int not null;');
		this.addSql(
			'alter table "budget_item" add constraint "budget_item_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade;'
		);
		this.addSql('alter table "budget_item" drop column "owner_email";');
	}

	async down(): Promise<void> {
		this.addSql('alter table "rental_asset" drop constraint "rental_asset_owner_id_foreign";');

		this.addSql(
			'alter table "one_time_income" drop constraint "one_time_income_owner_id_foreign";'
		);

		this.addSql(
			'alter table "financial_asset" drop constraint "financial_asset_owner_id_foreign";'
		);

		this.addSql('alter table "dividend" drop constraint "dividend_owner_id_foreign";');

		this.addSql('alter table "cap_asset" drop constraint "cap_asset_owner_id_foreign";');

		this.addSql('alter table "budget_item" drop constraint "budget_item_owner_id_foreign";');

		this.addSql('alter table "users" drop constraint "users_pkey";');
		this.addSql('alter table "users" drop column "id";');
		this.addSql('alter table "users" add constraint "users_pkey" primary key ("email");');

		this.addSql('alter table "rental_asset" add column "owner_email" varchar(255) not null;');
		this.addSql(
			'alter table "rental_asset" add constraint "rental_asset_owner_email_foreign" foreign key ("owner_email") references "users" ("email") on update cascade;'
		);
		this.addSql('alter table "rental_asset" drop column "owner_id";');

		this.addSql('alter table "one_time_income" add column "owner_email" varchar(255) not null;');
		this.addSql(
			'alter table "one_time_income" add constraint "one_time_income_owner_email_foreign" foreign key ("owner_email") references "users" ("email") on update cascade;'
		);
		this.addSql('alter table "one_time_income" drop column "owner_id";');

		this.addSql('alter table "financial_asset" add column "owner_email" varchar(255) not null;');
		this.addSql(
			'alter table "financial_asset" add constraint "financial_asset_owner_email_foreign" foreign key ("owner_email") references "users" ("email") on update cascade;'
		);
		this.addSql('alter table "financial_asset" drop column "owner_id";');

		this.addSql('alter table "dividend" add column "owner_email" varchar(255) not null;');
		this.addSql(
			'alter table "dividend" add constraint "dividend_owner_email_foreign" foreign key ("owner_email") references "users" ("email") on update cascade;'
		);
		this.addSql('alter table "dividend" drop column "owner_id";');

		this.addSql('alter table "cap_asset" add column "owner_email" varchar(255) not null;');
		this.addSql(
			'alter table "cap_asset" add constraint "cap_asset_owner_email_foreign" foreign key ("owner_email") references "users" ("email") on update cascade;'
		);
		this.addSql('alter table "cap_asset" drop column "owner_id";');

		this.addSql('alter table "budget_item" add column "owner_email" varchar(255) not null;');
		this.addSql(
			'alter table "budget_item" add constraint "budget_item_owner_email_foreign" foreign key ("owner_email") references "users" ("email") on update cascade;'
		);
		this.addSql('alter table "budget_item" drop column "owner_id";');
	}
}
