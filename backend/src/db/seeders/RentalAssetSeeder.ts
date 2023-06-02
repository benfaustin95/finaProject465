import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { FinancialAsset } from "../entities/financialasset.js";
import { RentalAsset } from "../entities/rentalasset.js";

export class RentalAssetSeeder extends Seeder {
	async run(em: EntityManager, context: Dictionary): Promise<void> {
		const RentalAssetRepo = em.getRepository(RentalAsset);

		// https://mikro-orm.io/docs/seeding#shared-context

		RentalAssetRepo.create({
			owner: context.user1,
			name: "House One",
			note: "",
			growthRate: 1.04,
			totalValue: 2000000,
			costBasis: 1000000,
			owed: 0,
			maintenanceExpense: 400,
			grossIncome: 3570,
			wPriority: 1,
			state: context.state,
			federal: context.federal,
		});
		RentalAssetRepo.create({
			owner: context.user1,
			name: "House Two",
			note: "",
			growthRate: 1.04,
			totalValue: 850000,
			costBasis: 510000,
			owed: 314000,
			maintenanceExpense: 3000,
			grossIncome: 2640,
			state: context.state,
			federal: context.federal,
			wPriority: 2,
		});
		RentalAssetRepo.create({
			owner: context.user1,
			name: "House Three",
			note: "",
			growthRate: 1.04,
			totalValue: 550000,
			costBasis: 325000,
			owed: 25000,
			maintenanceExpense: 3100,
			grossIncome: 3500,
			state: context.state,
			federal: context.federal,
			wPriority: 3,
		});
	}
}
