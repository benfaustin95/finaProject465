import { Migration } from "@mikro-orm/migrations";

export class Migration20230605203820 extends Migration {
	async up(): Promise<void> {
		this.addSql('alter table "rental_asset" drop constraint "rental_asset_name_unique";');

		this.addSql('alter table "one_time_income" drop constraint "one_time_income_name_unique";');

		this.addSql('alter table "financial_asset" drop constraint "financial_asset_name_unique";');

		this.addSql('alter table "dividend" drop constraint "dividend_name_unique";');

		this.addSql('alter table "cap_asset" drop constraint "cap_asset_name_unique";');

		this.addSql('alter table "budget_item" drop constraint "budget_item_name_unique";');
	}

	async down(): Promise<void> {
		this.addSql(
			'alter table "rental_asset" add constraint "rental_asset_name_unique" unique ("name");'
		);

		this.addSql(
			'alter table "one_time_income" add constraint "one_time_income_name_unique" unique ("name");'
		);

		this.addSql(
			'alter table "financial_asset" add constraint "financial_asset_name_unique" unique ("name");'
		);

		this.addSql('alter table "dividend" add constraint "dividend_name_unique" unique ("name");');

		this.addSql('alter table "cap_asset" add constraint "cap_asset_name_unique" unique ("name");');

		this.addSql(
			'alter table "budget_item" add constraint "budget_item_name_unique" unique ("name");'
		);
	}
}
