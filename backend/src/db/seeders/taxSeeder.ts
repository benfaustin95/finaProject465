import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { User } from "../entities/User.js";
import { BudgetItem, Recurrence } from "../entities/budgetItem.js";
import { Level, TaxRate } from "../entities/Tax.js";

export class TaxSeeder extends Seeder {
	async run(em: EntityManager, context: Dictionary): Promise<void> {
		// https://mikro-orm.io/docs/seeding#shared-context

		context.federal = em.create(TaxRate, {
			level: Level.FEDERAL,
			location: "USA",
			rate: 0.22,
		});
		context.capGains = em.create(TaxRate, {
			level: Level.CAPGAINS,
			location: "USA",
			rate: 0.15,
		});
		context.state = em.create(TaxRate, {
			level: Level.STATE,
			location: "Oregon",
			rate: 0.07,
		});
		context.local = em.create(TaxRate, {
			level: Level.LOCAL,
			location: "Washington County",
			rate: 0.01,
		});
		context.fica = em.create(TaxRate, {
			level: Level.FICA,
			location: "USA",
			rate: 0.06,
		});
	}
}
