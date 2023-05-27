import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import {UserSeeder} from "./UserSeeder.js";
import {BudgetSeeder} from "./BudgetSeeder.js";
import {TaxItem} from "../entities/Tax.js";
import {TaxSeeder} from "./taxSeeder.js";
import {CapAssetSeeder} from "./CapAssetSeeder.js";
import {FinancialAsset} from "../entities/financialasset.js";
import {FinAssetSeeder} from "./FinAssetSeeder.js";
import {RentalAssetSeeder} from "./RentalAssetSeeder.js";
import {DividendSeeder} from "./DividendSeeder.js";
import {OneTimeIncomeSeeder} from "./OneTimeIncomeSeeder.js";

export class DatabaseSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		return this.call(em, [
			UserSeeder,
			BudgetSeeder,
			TaxSeeder,
			FinAssetSeeder,
			CapAssetSeeder,
			RentalAssetSeeder,
			DividendSeeder,
			OneTimeIncomeSeeder
		]);
	}
}
