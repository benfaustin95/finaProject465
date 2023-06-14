import { Migration } from "@mikro-orm/migrations";

export class Migration20230607055613 extends Migration {
	async up(): Promise<void> {
		this.addSql('alter table "rental_asset" drop constraint "rental_asset_w_priority_unique";');

		this.addSql(
			'alter table "financial_asset" drop constraint "financial_asset_w_priority_unique";'
		);
	}

	async down(): Promise<void> {
		this.addSql(
			'alter table "rental_asset" add constraint "rental_asset_w_priority_unique" unique ("w_priority");'
		);

		this.addSql(
			'alter table "financial_asset" add constraint "financial_asset_w_priority_unique" unique ("w_priority");'
		);
	}
}
