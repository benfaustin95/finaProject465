import { Migration } from "@mikro-orm/migrations";

export class Migration20230527192029 extends Migration {
	async up(): Promise<void> {
		this.addSql('alter table "tax_item" drop constraint if exists "tax_item_level_check";');

		this.addSql('alter table "tax_item" alter column "level" type text using ("level"::text);');
		this.addSql(
			"alter table \"tax_item\" add constraint \"tax_item_level_check\" check (\"level\" in ('state', 'local', 'federal', 'capgains'));"
		);
	}

	async down(): Promise<void> {
		this.addSql('alter table "tax_item" drop constraint if exists "tax_item_level_check";');

		this.addSql('alter table "tax_item" alter column "level" type text using ("level"::text);');
		this.addSql(
			"alter table \"tax_item\" add constraint \"tax_item_level_check\" check (\"level\" in ('state', 'local', 'federal'));"
		);
	}
}
