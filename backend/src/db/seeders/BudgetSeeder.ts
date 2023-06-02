import type { Dictionary, EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { User } from "../entities/User.js";
import { BudgetItem, Recurrence } from "../entities/budgetItem.js";

export class BudgetSeeder extends Seeder {
	async run(em: EntityManager, context: Dictionary): Promise<void> {
		const budgetRepo = em.getRepository(BudgetItem);

		// https://mikro-orm.io/docs/seeding#shared-context

		budgetRepo.create({
			owner: context.user1,
			name: "Car Payment Monthly",
			note: "",
			amount: 300,
			recurrence: Recurrence.MONTHLY,
			start: new Date("1/1/2026"),
			end: new Date("1/1/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Fuel",
			note: "",
			amount: 50,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("1/01/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Auto Insurance",
			note: "",
			amount: 125,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("1/01/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Auto Registration",
			note: "",
			amount: 30,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("1/01/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Auto Service and Parts",
			note: "",
			amount: 70,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("1/01/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Utilities:Electricity",
			note: "",
			amount: 120,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("1/01/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Utilities:Gas",
			note: "",
			amount: 120,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("1/01/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Utilities:Internet and Cable",
			note: "",
			amount: 75,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("1/01/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Utilities:Mobile Phone",
			note: "",
			amount: 50,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("1/01/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Utilities:Water and Sewer",
			note: "",
			amount: 50,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("1/01/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Clothing",
			note: "",
			amount: 300,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("1/01/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Entertainment: Spending",
			note: "",
			amount: 600,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("1/01/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Food and Drink: Dining Out",
			note: "",
			amount: 300,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("1/01/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Food and Drink: Groceries",
			note: "",
			amount: 325,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("1/01/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "HOA Dues",
			note: "",
			amount: 20,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("1/01/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Home: Home Improvement",
			note: "",
			amount: 300,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("1/01/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Home: Home Insurance",
			note: "",
			amount: 125,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("1/01/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Home: Mortgage",
			note: "",
			growthRate: 0,
			amount: 975,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("12/31/2052"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Home: Property Taxes",
			note: "",
			amount: 200,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("01/01/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Home: Major House Spending",
			note: "",
			amount: 500,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("01/01/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Medical: Medical Premium",
			note: "Pre Medicare (Pre 65)",
			amount: 800,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("12/31/2026"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Medical: Dental and Vision Premium",
			note: "Pre Medicare (Pre 65)",
			amount: 100,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("12/31/2026"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Medical: Medicare Premium",
			note: "Medicare (>=65)",
			amount: 453,
			recurrence: Recurrence.MONTHLY,
			start: new Date("1/01/2027"),
			end: new Date("12/31/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Medical: Medigap",
			note: "Medicare (>=65)",
			amount: 339,
			recurrence: Recurrence.MONTHLY,
			start: new Date("1/01/2027"),
			end: new Date("12/31/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Medical: Out of Pocket",
			note: "CoPays, Deductibles, CoInsurance",
			amount: 200,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("12/31/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Financial: Life Insurance",
			note: "",
			amount: 150,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("12/31/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Misc",
			note: "",
			amount: 100,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("12/31/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Pets",
			note: "Food and insurance",
			amount: 100,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("12/31/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Travel: Vacation",
			note: "Early",
			amount: 1000,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("12/31/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Christmas Spending",
			note: "",
			amount: 3000,
			recurrence: Recurrence.ANNUALLY,
			start: context.user1.start,
			end: new Date("12/31/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Gifts and Donations: Charity",
			note: "",
			amount: 100,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("12/31/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Boat Early",
			note: "Mooring, insurance, gas, ect..",
			amount: 600,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("12/31/2025"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Boat Late",
			note: "Mooring, insurance, gas, ect..",
			amount: 350,
			recurrence: Recurrence.MONTHLY,
			start: new Date("01/01/2026"),
			end: new Date("12/31/2032"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Yacht Club",
			note: "",
			amount: 25,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("12/31/2042"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Second House: Monthly Principle and Interest",
			note: "",
			amount: 1920,
			growthRate: 0,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("12/31/2053"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Second House: Taxes and Insurance",
			note: "",
			amount: 300,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("12/31/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Second House: HOA fees and Utilities",
			note: "",
			amount: 300,
			recurrence: Recurrence.MONTHLY,
			start: context.user1.start,
			end: new Date("12/31/3000"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Second House: Down Payment",
			note: "",
			amount: 80000,
			recurrence: Recurrence.NON,
			start: new Date("6/01/2023"),
			end: new Date("6/01/2023"),
		});
		budgetRepo.create({
			owner: context.user1,
			name: "Home: Roof",
			note: "",
			amount: 11000,
			recurrence: Recurrence.NON,
			start: new Date("01/01/2023"),
			end: new Date("01/01/2023"),
		});
	}
}
