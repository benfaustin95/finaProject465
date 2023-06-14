import { Migration } from "@mikro-orm/migrations";

export class Migration20230531162503 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'alter table "rental_asset" add column "fica_level" varchar(255) null, add column "fica_location" varchar(255) null;'
		);
		this.addSql(
			'alter table "rental_asset" add constraint "rental_asset_fica_level_fica_location_foreign" foreign key ("fica_level", "fica_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);

		this.addSql(
			'alter table "one_time_income" add column "fica_level" varchar(255) null, add column "fica_location" varchar(255) null;'
		);
		this.addSql(
			'alter table "one_time_income" add constraint "one_time_income_fica_level_fica_location_foreign" foreign key ("fica_level", "fica_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);

		this.addSql(
			'alter table "financial_asset" add column "fica_level" varchar(255) null, add column "fica_location" varchar(255) null;'
		);
		this.addSql(
			'alter table "financial_asset" add constraint "financial_asset_fica_level_fica_location_foreign" foreign key ("fica_level", "fica_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);

		this.addSql(
			'alter table "dividend" add column "fica_level" varchar(255) null, add column "fica_location" varchar(255) null;'
		);
		this.addSql(
			'alter table "dividend" add constraint "dividend_fica_level_fica_location_foreign" foreign key ("fica_level", "fica_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);

		this.addSql(
			'alter table "cap_asset" add column "fica_level" varchar(255) null, add column "fica_location" varchar(255) null;'
		);
		this.addSql(
			'alter table "cap_asset" add constraint "cap_asset_fica_level_fica_location_foreign" foreign key ("fica_level", "fica_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);

		this.addSql(
			'alter table "budget_item" add column "fica_level" varchar(255) null, add column "fica_location" varchar(255) null;'
		);
		this.addSql(
			'alter table "budget_item" add constraint "budget_item_fica_level_fica_location_foreign" foreign key ("fica_level", "fica_location") references "tax_rate" ("level", "location") on update cascade on delete set null;'
		);
	}

	async down(): Promise<void> {
		this.addSql(
			'alter table "rental_asset" drop constraint "rental_asset_fica_level_fica_location_foreign";'
		);

		this.addSql(
			'alter table "one_time_income" drop constraint "one_time_income_fica_level_fica_location_foreign";'
		);

		this.addSql(
			'alter table "financial_asset" drop constraint "financial_asset_fica_level_fica_location_foreign";'
		);

		this.addSql(
			'alter table "dividend" drop constraint "dividend_fica_level_fica_location_foreign";'
		);

		this.addSql(
			'alter table "cap_asset" drop constraint "cap_asset_fica_level_fica_location_foreign";'
		);

		this.addSql(
			'alter table "budget_item" drop constraint "budget_item_fica_level_fica_location_foreign";'
		);

		this.addSql('alter table "rental_asset" drop column "fica_level";');
		this.addSql('alter table "rental_asset" drop column "fica_location";');

		this.addSql('alter table "one_time_income" drop column "fica_level";');
		this.addSql('alter table "one_time_income" drop column "fica_location";');

		this.addSql('alter table "financial_asset" drop column "fica_level";');
		this.addSql('alter table "financial_asset" drop column "fica_location";');

		this.addSql('alter table "dividend" drop column "fica_level";');
		this.addSql('alter table "dividend" drop column "fica_location";');

		this.addSql('alter table "cap_asset" drop column "fica_level";');
		this.addSql('alter table "cap_asset" drop column "fica_location";');

		this.addSql('alter table "budget_item" drop column "fica_level";');
		this.addSql('alter table "budget_item" drop column "fica_location";');
	}
}
