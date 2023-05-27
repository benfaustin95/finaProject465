import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { User } from "../entities/User.js";
import { BudgetItem, Recurrence } from "../entities/budgetItem.js";
import { CapAsset } from "../entities/capasset.js";
import { Dividend } from "../entities/Dividend.js";

export class DividendSeeder extends Seeder {
	async run(em: EntityManager, context: Dictionary): Promise<void> {
		const DivdendRepo = em.getRepository(Dividend);

		// https://mikro-orm.io/docs/seeding#shared-context

		DivdendRepo.create({
			owner: context.user1,
			name: "Dividend1",
			note: "Dividend1 seeder user1",
			state: context.state,
			federal: context.federal,
			rate: .05,
			asset: context.finAsset1,
		});
		DivdendRepo.create({
			owner: context.user1,
			name: "Dividend2",
			note: "Dividend2 seeder user1",
			state: context.state,
			rate: .10,
			asset: context.finAsset2,
		});
	}
}
