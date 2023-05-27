import { Migration } from "@mikro-orm/migrations";

export class Migration20230526004146 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'alter table "rental_asset" alter column "note" type varchar(255) using ("note"::varchar(255));'
		);
		this.addSql('alter table "rental_asset" alter column "note" set default \'\';');
		this.addSql('alter table "rental_asset" alter column "note" set not null;');

		this.addSql(
			'alter table "financial_asset" alter column "note" type varchar(255) using ("note"::varchar(255));'
		);
		this.addSql('alter table "financial_asset" alter column "note" set default \'\';');
		this.addSql('alter table "financial_asset" alter column "note" set not null;');

		this.addSql(
			'alter table "dividend" alter column "note" type varchar(255) using ("note"::varchar(255));'
		);
		this.addSql('alter table "dividend" alter column "note" set default \'\';');
		this.addSql('alter table "dividend" alter column "note" set not null;');

		this.addSql(
			'alter table "cap_asset" alter column "note" type varchar(255) using ("note"::varchar(255));'
		);
		this.addSql('alter table "cap_asset" alter column "note" set default \'\';');
		this.addSql('alter table "cap_asset" alter column "note" set not null;');

		this.addSql(
			'alter table "budget_item" alter column "note" type varchar(255) using ("note"::varchar(255));'
		);
		this.addSql('alter table "budget_item" alter column "note" set default \'\';');
		this.addSql('alter table "budget_item" alter column "note" set not null;');
		this.addSql(
			'alter table "budget_item" alter column "start" type timestamptz(0) using ("start"::timestamptz(0));'
		);
		this.addSql('alter table "budget_item" alter column "start" set not null;');
		this.addSql(
			'alter table "budget_item" alter column "end" type timestamptz(0) using ("end"::timestamptz(0));'
		);
		this.addSql('alter table "budget_item" alter column "end" set not null;');
	}

	async down(): Promise<void> {
		this.addSql('alter table "rental_asset" alter column "note" drop default;');
		this.addSql(
			'alter table "rental_asset" alter column "note" type varchar(255) using ("note"::varchar(255));'
		);
		this.addSql('alter table "rental_asset" alter column "note" drop not null;');

		this.addSql('alter table "financial_asset" alter column "note" drop default;');
		this.addSql(
			'alter table "financial_asset" alter column "note" type varchar(255) using ("note"::varchar(255));'
		);
		this.addSql('alter table "financial_asset" alter column "note" drop not null;');

		this.addSql('alter table "dividend" alter column "note" drop default;');
		this.addSql(
			'alter table "dividend" alter column "note" type varchar(255) using ("note"::varchar(255));'
		);
		this.addSql('alter table "dividend" alter column "note" drop not null;');

		this.addSql('alter table "cap_asset" alter column "note" drop default;');
		this.addSql(
			'alter table "cap_asset" alter column "note" type varchar(255) using ("note"::varchar(255));'
		);
		this.addSql('alter table "cap_asset" alter column "note" drop not null;');

		this.addSql('alter table "budget_item" alter column "note" drop default;');
		this.addSql(
			'alter table "budget_item" alter column "note" type varchar(255) using ("note"::varchar(255));'
		);
		this.addSql('alter table "budget_item" alter column "note" drop not null;');
		this.addSql(
			'alter table "budget_item" alter column "start" type timestamptz(0) using ("start"::timestamptz(0));'
		);
		this.addSql('alter table "budget_item" alter column "start" drop not null;');
		this.addSql(
			'alter table "budget_item" alter column "end" type timestamptz(0) using ("end"::timestamptz(0));'
		);
		this.addSql('alter table "budget_item" alter column "end" drop not null;');
	}
}
