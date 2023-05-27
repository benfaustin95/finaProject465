import { Entity, Enum, ManyToOne, Property, Unique } from "@mikro-orm/core";
import { BaseInput } from "./BaseInput.js";

@Entity()
export class BudgetItem extends BaseInput {

	@Property()
	amount!: number;

	@Enum(() => Recurrence)
	recurrence!: Recurrence;

	@Property()
	start: Date;

	@Property()
	end: Date;
}

export enum Recurrence {
	DAILY = "daily",
	WEEKLY = "weekly",
	MONTHLY = "monthly",
	ANNUALLY = "annually",
	NON = "non-reoccurring",
}
