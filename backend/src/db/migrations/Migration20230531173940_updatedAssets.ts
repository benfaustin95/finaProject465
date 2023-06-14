import { Migration } from "@mikro-orm/migrations";

export class Migration20230531173940 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'alter table "rental_asset" alter column "cost_basis" type int using ("cost_basis"::int);'
		);
		this.addSql('alter table "rental_asset" alter column "cost_basis" set default 0;');

		this.addSql(
			'alter table "financial_asset" alter column "cost_basis" type int using ("cost_basis"::int);'
		);
		this.addSql('alter table "financial_asset" alter column "cost_basis" set default 0;');
	}

	async down(): Promise<void> {
		this.addSql('alter table "rental_asset" alter column "cost_basis" drop default;');
		this.addSql(
			'alter table "rental_asset" alter column "cost_basis" type int using ("cost_basis"::int);'
		);

		this.addSql('alter table "financial_asset" alter column "cost_basis" drop default;');
		this.addSql(
			'alter table "financial_asset" alter column "cost_basis" type int using ("cost_basis"::int);'
		);
	}
}
