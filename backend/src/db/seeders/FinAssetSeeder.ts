import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { User } from "../entities/User.js";
import { BudgetItem, Recurrence } from "../entities/budgetItem.js";
import { CapAsset } from "../entities/capasset.js";
import { FinancialAsset } from "../entities/financialasset.js";

export class FinAssetSeeder extends Seeder {
	async run(em: EntityManager, context: Dictionary): Promise<void> {
		// https://mikro-orm.io/docs/seeding#shared-context

		context.finAsset1 = em.create(FinancialAsset, {
			owner: context.user1,
			name: "Schwabb Brokerage",
			note: "",
			growthRate: 1.04,
			totalValue: 500000,
			costBasis: 100000,
			wPriority: 1,
			state: context.state,
			federal: context.capGains,
		});
		context.finAsset2 = em.create(FinancialAsset, {
			owner: context.user1,
			name: "Schwabb IRA",
			note: "",
			growthRate: 1.04,
			totalValue: 500000,
			wPriority: 5,
			federal: context.federal,
			state: context.state,
		});
		context.finAsset2 = em.create(FinancialAsset, {
			owner: context.user1,
			name: "TD Ameritrade Brokerage One",
			note: "",
			growthRate: 1.04,
			totalValue: 100000,
			costBasis: 90000,
			wPriority: 2,
			state: context.state,
			capitalGains: context.capGains,
		});
		context.finAsset3 = em.create(FinancialAsset, {
			owner: context.user1,
			name: "TD Ameritrade Brokerage Two",
			note: "",
			growthRate: 1.04,
			totalValue: 100000,
			costBasis: 17477,
			wPriority: 3,
			state: context.state,
			capitalGains: context.capGains,
		});
		context.finAsset4 = em.create(FinancialAsset, {
			owner: context.user1,
			name: "Cash",
			note: "",
			growthRate: 0,
			totalValue: 50000,
			costBasis: 50000,
			wPriority: 4,
			state: context.state,
			federal: context.federal,
		});
		context.finAsset5 = em.create(FinancialAsset, {
			owner: context.user1,
			name: "Schwabb Roth IRA",
			note: "",
			growthRate: 1.06,
			totalValue: 900000,
			wPriority: 6,
		});
	}
}
