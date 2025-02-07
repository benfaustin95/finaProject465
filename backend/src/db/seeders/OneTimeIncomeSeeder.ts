import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { User } from "../entities/User.js";
import { BudgetItem, Recurrence } from "../entities/budgetItem.js";
import { CapAsset } from "../entities/capasset.js";
import { Dividend } from "../entities/Dividend.js";
import { OneTimeIncome } from "../entities/OneTimeIncome.js";

export class OneTimeIncomeSeeder extends Seeder {
	async run(em: EntityManager, context: Dictionary): Promise<void> {
		const OneTimeRepo = em.getRepository(OneTimeIncome);

		// https://mikro-orm.io/docs/seeding#shared-context

		OneTimeRepo.create({
			owner: context.user1,
			name: "Sale Art",
			note: "Assume 2023",
			capitalGains: context.capGains,
			state: context.state,
			date: new Date("1/1/2023"),
			cashBasis: 400000,
		});
	}
}
