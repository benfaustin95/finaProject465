import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { User } from "../entities/User.js";
import { BudgetItem, Recurrence } from "../entities/budgetItem.js";
import { CapAsset, CapAssetType } from "../entities/capasset.js";

export class CapAssetSeeder extends Seeder {
	async run(em: EntityManager, context: Dictionary): Promise<void> {
		const CapAssetRepo = em.getRepository(CapAsset);

		// https://mikro-orm.io/docs/seeding#shared-context

		CapAssetRepo.create({
			owner: context.user1,
			name: "Final Work Year",
			note: "",
			income: 8000,
			recurrence: Recurrence.MONTHLY,
			start: new Date("4/1/2023"),
			end: new Date("12/31/2023"),
			state: context.state,
			federal: context.federal,
			local: context.local,
			fica: context.fica,
			type: CapAssetType.HUMAN,
		});
		CapAssetRepo.create({
			owner: context.user1,
			name: "Part time work",
			note: "",
			income: 1000,
			recurrence: Recurrence.MONTHLY,
			start: new Date("1/1/2025"),
			end: new Date("12/31/2026"),
			state: context.state,
			federal: context.federal,
			local: context.local,
			fica: context.fica,
			type: CapAssetType.HUMAN,
		});
		CapAssetRepo.create({
			owner: context.user1,
			name: "Social Security",
			note: "",
			income: 2600,
			recurrence: Recurrence.MONTHLY,
			start: new Date("10/1/2032"),
			end: new Date("12/31/3000"),
			state: context.state,
			federal: context.federal,
			type: CapAssetType.SOCIAL,
		});
		CapAssetRepo.create({
			owner: context.user1,
			name: "Pension",
			note: "",
			income: 200,
			growthRate: 0,
			recurrence: Recurrence.MONTHLY,
			start: new Date("10/1/2027"),
			end: new Date("12/31/3000"),
			state: context.state,
			federal: context.federal,
			type: CapAssetType.SOCIAL,
		});
		CapAssetRepo.create({
			owner: context.user1,
			name: "AIG",
			note: "",
			income: 2000,
			growthRate: 0,
			recurrence: Recurrence.MONTHLY,
			start: new Date("01/1/2033"),
			end: new Date("12/31/3000"),
			type: CapAssetType.NONTAXABLEANNUITY,
		});
	}
}
