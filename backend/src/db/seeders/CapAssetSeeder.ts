import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { User } from "../entities/User.js";
import { BudgetItem, Recurrence } from "../entities/budgetItem.js";
import {CapAsset, CapAssetType} from "../entities/capasset.js";

export class CapAssetSeeder extends Seeder {
	async run(em: EntityManager, context: Dictionary): Promise<void> {
		const CapAssetRepo = em.getRepository(CapAsset);

		// https://mikro-orm.io/docs/seeding#shared-context

		CapAssetRepo.create({
			owner: context.user1,
			name: "CapAsset1",
			note: "Cap Asset1 seeder user1",
			growthRate: 1.2,
			income: 1200,
			recurrence: Recurrence.MONTHLY,
			start: new Date("1/1/2023"),
			end: new Date("1/31/2027"),
			state: context.state,
			federal: context.federal,
			type: CapAssetType.HUMAN
		});
		CapAssetRepo.create({
			owner: context.user1,
			name: "CapAsset2",
			note: "Cap Asset2 seeder user1",
			growthRate: 1.2,
			income: 1000,
			recurrence: Recurrence.MONTHLY,
			start: new Date("1/1/2023"),
			end: new Date("1/31/3000"),
			state: context.state,
			federal: context.federal,
			local: context.local,
			type:CapAssetType.SOCIAL
		});
		CapAssetRepo.create({
			owner: context.user1,
			name: "CapAsset3",
			note: "Cap Asset3 seeder user1",
			growthRate: 1.2,
			income: 1000,
			recurrence: Recurrence.ANNUALLY,
			start: new Date("1/1/2023"),
			end: new Date("1/31/3000"),
			state: context.state,
			federal: context.federal,
			local: context.local,
			type: CapAssetType.NONTAXABLEANNUITY
		});
		CapAssetRepo.create({
			owner: context.user1,
			name: "CapAsset4",
			note: "Cap Asset4 seeder user1",
			growthRate: 1.2,
			income: 10,
			recurrence: Recurrence.DAILY,
			start: new Date("1/1/2023"),
			end: new Date("1/31/2030"),
			federal: context.federal,
			local: context.local,
			type: CapAssetType.HUMAN
		});
		CapAssetRepo.create({
			owner: context.user1,
			name: "CapAsset5",
			note: "Cap Asset4 seeder user1",
			growthRate: 1.2,
			income: 100000,
			recurrence: Recurrence.NON,
			start: new Date("3/14/2024"),
			end: new Date("3/14/2024"),
			state: context.state,
			type: CapAssetType.HUMAN
		});
	}
}
