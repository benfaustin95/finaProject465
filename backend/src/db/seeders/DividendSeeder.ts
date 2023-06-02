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
			name: "Schawbb Brokerage",
			note: "",
			state: context.state,
			federal: context.federal,
			rate: 0.015,
			asset: context.finAsset1,
		});
		DivdendRepo.create({
			owner: context.user1,
			name: "TD Ameritrade Brokerage",
			note: "",
			state: context.state,
			federal: context.federal,
			rate: 0.02,
			asset: context.finAsset2,
		});
		DivdendRepo.create({
			owner: context.user1,
			name: "TD Ameritrade Brokerage two",
			note: "",
			state: context.state,
			federal: context.federal,
			rate: 0.005,
			asset: context.finAsset3,
		});
	}
}
