import { Migration } from "@mikro-orm/migrations";

export class Migration20230527193744 extends Migration {
	async up(): Promise<void> {
		this.addSql('alter table "tax_item" drop constraint if exists "tax_item_level_check";');

		this.addSql(
			'alter table "tax_item" alter column "level" type varchar(255) using ("level"::varchar(255));'
		);

		this.addSql(
			'alter table "rental_asset" alter column "state_level" type varchar(255) using ("state_level"::varchar(255));'
		);
		this.addSql(
			'alter table "rental_asset" alter column "federal_level" type varchar(255) using ("federal_level"::varchar(255));'
		);
		this.addSql(
			'alter table "rental_asset" alter column "local_level" type varchar(255) using ("local_level"::varchar(255));'
		);

		this.addSql(
			'alter table "one_time_income" alter column "state_level" type varchar(255) using ("state_level"::varchar(255));'
		);
		this.addSql(
			'alter table "one_time_income" alter column "federal_level" type varchar(255) using ("federal_level"::varchar(255));'
		);
		this.addSql(
			'alter table "one_time_income" alter column "local_level" type varchar(255) using ("local_level"::varchar(255));'
		);

		this.addSql(
			'alter table "financial_asset" alter column "state_level" type varchar(255) using ("state_level"::varchar(255));'
		);
		this.addSql(
			'alter table "financial_asset" alter column "federal_level" type varchar(255) using ("federal_level"::varchar(255));'
		);
		this.addSql(
			'alter table "financial_asset" alter column "local_level" type varchar(255) using ("local_level"::varchar(255));'
		);

		this.addSql(
			'alter table "dividend" alter column "state_level" type varchar(255) using ("state_level"::varchar(255));'
		);
		this.addSql(
			'alter table "dividend" alter column "federal_level" type varchar(255) using ("federal_level"::varchar(255));'
		);
		this.addSql(
			'alter table "dividend" alter column "local_level" type varchar(255) using ("local_level"::varchar(255));'
		);

		this.addSql(
			'alter table "cap_asset" alter column "state_level" type varchar(255) using ("state_level"::varchar(255));'
		);
		this.addSql(
			'alter table "cap_asset" alter column "federal_level" type varchar(255) using ("federal_level"::varchar(255));'
		);
		this.addSql(
			'alter table "cap_asset" alter column "local_level" type varchar(255) using ("local_level"::varchar(255));'
		);

		this.addSql(
			'alter table "budget_item" alter column "state_level" type varchar(255) using ("state_level"::varchar(255));'
		);
		this.addSql(
			'alter table "budget_item" alter column "federal_level" type varchar(255) using ("federal_level"::varchar(255));'
		);
		this.addSql(
			'alter table "budget_item" alter column "local_level" type varchar(255) using ("local_level"::varchar(255));'
		);
	}

	async down(): Promise<void> {
		this.addSql('alter table "tax_item" alter column "level" type text using ("level"::text);');
		this.addSql(
			"alter table \"tax_item\" add constraint \"tax_item_level_check\" check (\"level\" in ('state', 'local', 'federal', 'capgains'));"
		);

		this.addSql(
			'alter table "rental_asset" alter column "state_level" type text using ("state_level"::text);'
		);
		this.addSql(
			'alter table "rental_asset" alter column "federal_level" type text using ("federal_level"::text);'
		);
		this.addSql(
			'alter table "rental_asset" alter column "local_level" type text using ("local_level"::text);'
		);

		this.addSql(
			'alter table "one_time_income" alter column "state_level" type text using ("state_level"::text);'
		);
		this.addSql(
			'alter table "one_time_income" alter column "federal_level" type text using ("federal_level"::text);'
		);
		this.addSql(
			'alter table "one_time_income" alter column "local_level" type text using ("local_level"::text);'
		);

		this.addSql(
			'alter table "financial_asset" alter column "state_level" type text using ("state_level"::text);'
		);
		this.addSql(
			'alter table "financial_asset" alter column "federal_level" type text using ("federal_level"::text);'
		);
		this.addSql(
			'alter table "financial_asset" alter column "local_level" type text using ("local_level"::text);'
		);

		this.addSql(
			'alter table "dividend" alter column "state_level" type text using ("state_level"::text);'
		);
		this.addSql(
			'alter table "dividend" alter column "federal_level" type text using ("federal_level"::text);'
		);
		this.addSql(
			'alter table "dividend" alter column "local_level" type text using ("local_level"::text);'
		);

		this.addSql(
			'alter table "cap_asset" alter column "state_level" type text using ("state_level"::text);'
		);
		this.addSql(
			'alter table "cap_asset" alter column "federal_level" type text using ("federal_level"::text);'
		);
		this.addSql(
			'alter table "cap_asset" alter column "local_level" type text using ("local_level"::text);'
		);

		this.addSql(
			'alter table "budget_item" alter column "state_level" type text using ("state_level"::text);'
		);
		this.addSql(
			'alter table "budget_item" alter column "federal_level" type text using ("federal_level"::text);'
		);
		this.addSql(
			'alter table "budget_item" alter column "local_level" type text using ("local_level"::text);'
		);
	}
}
