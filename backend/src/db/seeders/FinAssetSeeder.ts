import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from '@mikro-orm/seeder';
import {User} from "../entities/User.js";
import {BudgetItem, Recurrence} from "../entities/budgetItem.js";
import {CapAsset} from "../entities/capasset.js";
import {FinancialAsset} from "../entities/financialasset.js";

export class FinAssetSeeder extends Seeder {
	async run(em: EntityManager, context: Dictionary): Promise<void> {


		// https://mikro-orm.io/docs/seeding#shared-context

		context.finAsset1 = em.create(FinancialAsset, {
			owner: context.user1,
			name: "FinAsset1",
			note: "Fin Asset1 seeder user1",
			growthRate: 1.2,
			totalValue: 120000,
			costBasis: 100000,
			wPriority: 1
		});
		context.finAsset2 = em.create(FinancialAsset, {
			owner: context.user1,
			name: "FinAsset2",
			note: "Fin Asset2 seeder user1",
			growthRate: 1.3,
			totalValue: 150000,
			costBasis: 110000,
			wPriority: 2,
			state: context.state,
			federal: context.federal,
		});
		context.finAsset3= em.create(FinancialAsset, {
			owner: context.user1,
			name: "FinAsset3",
			note: "Fin Asset3 seeder user1",
			growthRate: 1.1,
			totalValue: 100000,
			costBasis: 90000,
			wPriority: 3,
			federal: context.federal
		});
	}
}
