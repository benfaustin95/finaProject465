import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { User } from "../entities/User.js";
import { BudgetItem, Recurrence } from "../entities/budgetItem.js";
import { Level, TaxItem } from "../entities/Tax.js";

export class TaxSeeder extends Seeder {
	async run(em: EntityManager, context: Dictionary): Promise<void> {
		// https://mikro-orm.io/docs/seeding#shared-context

		context.federal = em.create(TaxItem, {
			level: Level.FEDERAL,
			location: "USA",
			rate: .24,
		});
		context.state = em.create(TaxItem, {
			level: Level.STATE,
			location: "Oregon",
			rate: .14,
		});
		context.local = em.create(TaxItem, {
			level: Level.LOCAL,
			location: "Washington County",
			rate: .14,
		});
	}
}
