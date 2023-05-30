import { Migration } from "@mikro-orm/migrations";

export class Migration20230527184618 extends Migration {
	async up(): Promise<void> {
		this.addSql('alter table "dividend" alter column "rate" type float using ("rate"::float);');
	}

	async down(): Promise<void> {
		this.addSql('alter table "dividend" alter column "rate" type int using ("rate"::int);');
	}
}
