import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from '@mikro-orm/seeder';
import {FinancialAsset} from "../entities/financialasset.js";
import {RentalAsset} from "../entities/rentalasset.js";

export class RentalAssetSeeder extends Seeder {
	async run(em: EntityManager, context: Dictionary): Promise<void> {

		const RentalAssetRepo = em.getRepository(RentalAsset);

		// https://mikro-orm.io/docs/seeding#shared-context

		RentalAssetRepo.create({
			owner: context.user1,
			name: "RentalAsset1",
			note: "Rental Asset1 seeder user1",
			growthRate: 1.2,
			totalValue: 120000,
			costBasis: 100000,
			owed: 90000,
			maintenanceExpense: 100,
			grossIncome: 1200,
			wPriority: 1
		});
		RentalAssetRepo.create({
			owner: context.user1,
			name: "RentalAsset2",
			note: "Rental Asset1 seeder user1",
			growthRate: 1.24,
			totalValue: 1200000,
			costBasis: 1000000,
			owed: 200000,
			maintenanceExpense: 1000,
			grossIncome: 9000,
			wPriority: 2
		});
	}
}
