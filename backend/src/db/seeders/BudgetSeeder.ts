import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from '@mikro-orm/seeder';
import {User} from "../entities/User.js";
import {BudgetItem, Recurrence} from "../entities/budgetItem.js";

export class BudgetSeeder extends Seeder {
	async run(em: EntityManager, context: Dictionary): Promise<void> {

		const budgetRepo = em.getRepository(BudgetItem);

		// https://mikro-orm.io/docs/seeding#shared-context

		budgetRepo.create({
			owner: context.user1,
			name: "CarPayment",
			note: "Car payment seeder user1",
			growthRate: 1.1,
			amount: 400,
			recurrence: Recurrence.MONTHLY,
			start: new Date("1/1/2023"),
			end: new Date("1/31/2027")
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Food",
			note: "Food payment seeder user1",
			growthRate: 1,
			amount: 1000,
			recurrence: Recurrence.MONTHLY,
			start: new Date(),
			end: new Date("1/01/3000")
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Housing",
			note: "Housing payment seeder user1",
			growthRate: 1,
			amount: 1000,
			recurrence: Recurrence.MONTHLY,
			start: new Date(),
			end: new Date("1/01/3000")
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Vacation",
			note: "Vacation payment seeder user1",
			growthRate: 1,
			amount: 10000,
			recurrence: Recurrence.ANNUALLY,
			start: new Date(),
			end: new Date("1/01/3000")
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Bribery",
			note: "Bribery payment seeder user1",
			growthRate: 1,
			amount: 100000,
			recurrence: Recurrence.NON,
			start: new Date("3/1/2026"),
			end: new Date("3/1/2026")
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Sadness",
			note: "Sadness payment seeder user1",
			growthRate: 1,
			amount: 100,
			recurrence: Recurrence.MONTHLY,
			start: new Date("3/1/2023"),
			end: new Date("5/1/2023")
		});
	}
}
